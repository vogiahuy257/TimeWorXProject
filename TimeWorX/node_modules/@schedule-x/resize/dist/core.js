import 'preact/jsx-runtime';

const getTimePointsPerPixel = ($app) => {
    return $app.config.timePointsPerDay / $app.config.weekOptions.value.gridHeight;
};

const DateFormats = {
    DATE_STRING: /^\d{4}-\d{2}-\d{2}$/,
    TIME_STRING: /^\d{2}:\d{2}$/,
    DATE_TIME_STRING: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
};

class InvalidDateTimeError extends Error {
    constructor(dateTimeSpecification) {
        super(`Invalid date time specification: ${dateTimeSpecification}`);
    }
}

const toJSDate = (dateTimeSpecification) => {
    if (!DateFormats.DATE_TIME_STRING.test(dateTimeSpecification) &&
        !DateFormats.DATE_STRING.test(dateTimeSpecification))
        throw new InvalidDateTimeError(dateTimeSpecification);
    return new Date(Number(dateTimeSpecification.slice(0, 4)), Number(dateTimeSpecification.slice(5, 7)) - 1, Number(dateTimeSpecification.slice(8, 10)), Number(dateTimeSpecification.slice(11, 13)), // for date strings this will be 0
    Number(dateTimeSpecification.slice(14, 16)) // for date strings this will be 0
    );
};
const toIntegers = (dateTimeSpecification) => {
    const hours = dateTimeSpecification.slice(11, 13), minutes = dateTimeSpecification.slice(14, 16);
    return {
        year: Number(dateTimeSpecification.slice(0, 4)),
        month: Number(dateTimeSpecification.slice(5, 7)) - 1,
        date: Number(dateTimeSpecification.slice(8, 10)),
        hours: hours !== '' ? Number(hours) : undefined,
        minutes: minutes !== '' ? Number(minutes) : undefined,
    };
};

class NumberRangeError extends Error {
    constructor(min, max) {
        super(`Number must be between ${min} and ${max}.`);
        Object.defineProperty(this, "min", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: min
        });
        Object.defineProperty(this, "max", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: max
        });
    }
}

const doubleDigit = (number) => {
    if (number < 0 || number > 99)
        throw new NumberRangeError(0, 99);
    return String(number).padStart(2, '0');
};

const toDateString = (date) => {
    return `${date.getFullYear()}-${doubleDigit(date.getMonth() + 1)}-${doubleDigit(date.getDate())}`;
};
const toTimeString = (date) => {
    return `${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}`;
};
const toDateTimeString = (date) => {
    return `${toDateString(date)} ${toTimeString(date)}`;
};

const minuteTimePointMultiplier = 1.6666666666666667; // 100 / 60
const addTimePointsToDateTime = (dateTimeString, pointsToAdd) => {
    const minutesToAdd = pointsToAdd / minuteTimePointMultiplier;
    const jsDate = toJSDate(dateTimeString);
    jsDate.setMinutes(jsDate.getMinutes() + minutesToAdd);
    return toDateTimeString(jsDate);
};

const updateEventsList = ($app, eventCopy, oldEventEnd, newEventEnd) => {
    const rrule = eventCopy._getForeignProperties().rrule;
    if (rrule && $app.config.plugins.eventRecurrence) {
        $app.config.plugins.eventRecurrence.updateRecurrenceOnResize(eventCopy.id, oldEventEnd, newEventEnd);
        return;
    }
    const eventToUpdate = $app.calendarEvents.list.value.find((event) => event.id === eventCopy.id);
    if (!eventToUpdate)
        return;
    eventToUpdate.end = eventCopy.end;
    $app.calendarEvents.list.value = [...$app.calendarEvents.list.value];
};

class TimeGridEventResizer {
    constructor($app, eventCopy, updateCopy, initialY, CHANGE_THRESHOLD_IN_TIME_POINTS, dayBoundariesDateTime) {
        Object.defineProperty(this, "$app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: $app
        });
        Object.defineProperty(this, "eventCopy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: eventCopy
        });
        Object.defineProperty(this, "updateCopy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: updateCopy
        });
        Object.defineProperty(this, "initialY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: initialY
        });
        Object.defineProperty(this, "CHANGE_THRESHOLD_IN_TIME_POINTS", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: CHANGE_THRESHOLD_IN_TIME_POINTS
        });
        Object.defineProperty(this, "dayBoundariesDateTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dayBoundariesDateTime
        });
        Object.defineProperty(this, "originalEventEnd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastIntervalDiff", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "lastValidEnd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "handleMouseMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                const pixelDiffY = event.clientY - this.initialY;
                const timePointsDiffY = pixelDiffY * getTimePointsPerPixel(this.$app);
                const currentIntervalDiff = Math.round(timePointsDiffY / this.CHANGE_THRESHOLD_IN_TIME_POINTS);
                const timeDidNotChange = currentIntervalDiff === this.lastIntervalDiff;
                if (timeDidNotChange)
                    return;
                this.lastIntervalDiff = currentIntervalDiff;
                this.setNewTimeForEventEnd(this.CHANGE_THRESHOLD_IN_TIME_POINTS * currentIntervalDiff);
            }
        });
        Object.defineProperty(this, "handleMouseUp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setNewTimeForEventEnd(this.CHANGE_THRESHOLD_IN_TIME_POINTS * this.lastIntervalDiff);
                updateEventsList(this.$app, this.eventCopy, this.originalEventEnd, this.lastValidEnd);
                this.updateCopy(undefined);
                this.$app.elements.calendarWrapper.classList.remove('sx__is-resizing');
                this.$app.elements.calendarWrapper.removeEventListener('mousemove', this.handleMouseMove);
                if (this.$app.config.callbacks.onEventUpdate) {
                    this.$app.config.callbacks.onEventUpdate(this.eventCopy._getExternalEvent());
                }
            }
        });
        this.originalEventEnd = this.eventCopy.end;
        this.lastValidEnd = this.eventCopy.end;
        const calendarWrapper = this.$app.elements.calendarWrapper;
        if (!calendarWrapper)
            return;
        calendarWrapper.classList.add('sx__is-resizing');
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.$app.elements.calendarWrapper.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp, { once: true });
    }
    setNewTimeForEventEnd(pointsToAdd) {
        const newEnd = addTimePointsToDateTime(this.originalEventEnd, pointsToAdd);
        if (newEnd > this.dayBoundariesDateTime.end ||
            newEnd <= this.eventCopy.start)
            return;
        this.lastValidEnd = newEnd;
        this.eventCopy.end = this.lastValidEnd;
        this.updateCopy(this.eventCopy);
    }
}

var PluginName;
(function (PluginName) {
    PluginName["DragAndDrop"] = "dragAndDrop";
    PluginName["EventModal"] = "eventModal";
    PluginName["ScrollController"] = "scrollController";
    PluginName["EventRecurrence"] = "eventRecurrence";
    PluginName["Resize"] = "resize";
    PluginName["CalendarControls"] = "calendarControls";
    PluginName["CurrentTime"] = "currentTime";
})(PluginName || (PluginName = {}));

const getTimeGridDayWidth = ($app) => {
    return $app.elements.calendarWrapper.querySelector('.sx__time-grid-day').clientWidth;
};

const definePlugin = (name, definition) => {
    definition.name = name;
    return definition;
};

var WeekDay;
(function (WeekDay) {
    WeekDay[WeekDay["SUNDAY"] = 0] = "SUNDAY";
    WeekDay[WeekDay["MONDAY"] = 1] = "MONDAY";
    WeekDay[WeekDay["TUESDAY"] = 2] = "TUESDAY";
    WeekDay[WeekDay["WEDNESDAY"] = 3] = "WEDNESDAY";
    WeekDay[WeekDay["THURSDAY"] = 4] = "THURSDAY";
    WeekDay[WeekDay["FRIDAY"] = 5] = "FRIDAY";
    WeekDay[WeekDay["SATURDAY"] = 6] = "SATURDAY";
})(WeekDay || (WeekDay = {}));

WeekDay.MONDAY;

const addDays = (to, nDays) => {
    const { year, month, date, hours, minutes } = toIntegers(to);
    const isDateTimeString = hours !== undefined && minutes !== undefined;
    const jsDate = new Date(year, month, date, hours !== null && hours !== void 0 ? hours : 0, minutes !== null && minutes !== void 0 ? minutes : 0);
    jsDate.setDate(jsDate.getDate() + nDays);
    if (isDateTimeString) {
        return toDateTimeString(jsDate);
    }
    return toDateString(jsDate);
};

class DateGridEventResizer {
    constructor($app, eventCopy, updateCopy, initialX) {
        Object.defineProperty(this, "$app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: $app
        });
        Object.defineProperty(this, "eventCopy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: eventCopy
        });
        Object.defineProperty(this, "updateCopy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: updateCopy
        });
        Object.defineProperty(this, "initialX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: initialX
        });
        Object.defineProperty(this, "dayWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "originalEventEnd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ORIGINAL_NDAYS", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastNDaysDiff", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "handleMouseMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                const xDifference = event.clientX - this.initialX;
                this.lastNDaysDiff = Math.floor(xDifference / this.dayWidth);
                this.setNewTimeForEventEnd();
            }
        });
        Object.defineProperty(this, "handleMouseUp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                updateEventsList(this.$app, this.eventCopy, this.originalEventEnd, this.eventCopy.end);
                this.updateCopy(undefined);
                this.$app.elements.calendarWrapper.classList.remove('sx__is-resizing');
                this.$app.elements.calendarWrapper.removeEventListener('mousemove', this.handleMouseMove);
                if (this.$app.config.callbacks.onEventUpdate) {
                    this.$app.config.callbacks.onEventUpdate(this.eventCopy._getExternalEvent());
                }
            }
        });
        this.originalEventEnd = eventCopy.end;
        this.ORIGINAL_NDAYS = eventCopy._nDaysInGrid || 0;
        const calendarWrapper = this.$app.elements.calendarWrapper;
        if (!calendarWrapper)
            return;
        calendarWrapper.classList.add('sx__is-resizing');
        this.dayWidth = getTimeGridDayWidth(this.$app);
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.$app.elements.calendarWrapper.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp, { once: true });
    }
    setNewTimeForEventEnd() {
        const newEnd = addDays(this.originalEventEnd, this.lastNDaysDiff);
        if (newEnd > this.$app.calendarState.range.value.end ||
            newEnd < this.eventCopy.start ||
            newEnd <
                toDateString(toJSDate(this.$app.calendarState.range.value.start)))
            return;
        this.eventCopy.end = newEnd;
        this.eventCopy._nDaysInGrid = this.ORIGINAL_NDAYS + this.lastNDaysDiff;
        this.updateCopy(this.eventCopy);
    }
}

class ResizePluginImpl {
    constructor(minutesPerInterval) {
        Object.defineProperty(this, "minutesPerInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: minutesPerInterval
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: PluginName.Resize
        });
        Object.defineProperty(this, "$app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    onRender($app) {
        this.$app = $app;
    }
    createTimeGridEventResizer(calendarEvent, updateCopy, mouseDownEvent, dayBoundariesDateTime) {
        if (!this.$app)
            return this.logError();
        new TimeGridEventResizer(this.$app, calendarEvent, updateCopy, mouseDownEvent.clientY, this.getTimePointsForIntervalConfig(), dayBoundariesDateTime);
    }
    createDateGridEventResizer(calendarEvent, updateCopy, mouseDownEvent) {
        if (!this.$app)
            return this.logError();
        new DateGridEventResizer(this.$app, calendarEvent, updateCopy, mouseDownEvent.clientX);
    }
    getTimePointsForIntervalConfig() {
        if (this.minutesPerInterval === 60)
            return 100;
        if (this.minutesPerInterval === 30)
            return 50;
        return 25;
    }
    logError() {
        console.error('The calendar is not yet initialized. Cannot resize events.');
    }
}
const createResizePlugin = (minutesPerInterval = 15) => {
    return definePlugin('resize', new ResizePluginImpl(minutesPerInterval));
};

export { createResizePlugin };
