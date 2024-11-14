import { jsx, Fragment, jsxs } from 'preact/jsx-runtime';
import { useState, useEffect } from 'preact/hooks';
import { signal, effect, batch } from '@preact/signals';

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

/**
 * Can be used for generating a random id for an entity
 * Should, however, never be used in potentially resource intense loops,
 * since the performance cost of this compared to new Date().getTime() is ca x4 in v8
 * */
const randomStringId = () => 's' + Math.random().toString(36).substring(2, 11);

const createClickOutsideListener = ($app, modalId) => {
    return function (e) {
        if (!(e.target instanceof HTMLElement))
            return;
        if (e.target.closest(`#${modalId}`))
            return;
        $app.config.plugins.eventModal.close();
    };
};

const setPosition = (appDOMRect, eventDOMRect, modalHeight = 250) => {
    const MODAL_WIDTH = 400;
    const INLINE_SPACE_BETWEEN_MODAL_AND_EVENT = 10;
    const WIDTH_NEEDED = MODAL_WIDTH + INLINE_SPACE_BETWEEN_MODAL_AND_EVENT;
    const hasSpaceTop = eventDOMRect.bottom - appDOMRect.top > modalHeight;
    const eventBottomLessThanAppBottom = eventDOMRect.bottom < appDOMRect.bottom;
    const eventTopLessThanAppTop = eventDOMRect.top < appDOMRect.top;
    let top = 0;
    let left = 0;
    let animationStart = '0%';
    if (appDOMRect.bottom - eventDOMRect.top > modalHeight &&
        !eventTopLessThanAppTop) {
        top = eventDOMRect.top;
    }
    else if (hasSpaceTop && eventBottomLessThanAppBottom) {
        top = eventDOMRect.bottom - modalHeight;
    }
    else if (hasSpaceTop && !eventBottomLessThanAppBottom) {
        top = appDOMRect.bottom - modalHeight;
    }
    else {
        top = appDOMRect.top;
    }
    if (appDOMRect.right - eventDOMRect.right > WIDTH_NEEDED) {
        left = eventDOMRect.right + INLINE_SPACE_BETWEEN_MODAL_AND_EVENT;
        animationStart = '-10%';
    }
    else if (eventDOMRect.left - appDOMRect.left > WIDTH_NEEDED) {
        left = eventDOMRect.left - WIDTH_NEEDED;
        animationStart = '10%';
    }
    else {
        left = appDOMRect.left;
    }
    document.documentElement.style.setProperty('--sx-event-modal-animation-start', animationStart);
    document.documentElement.style.setProperty('--sx-event-modal-top', `${top}px`);
    document.documentElement.style.setProperty('--sx-event-modal-left', `${left}px`);
};

/**
 * Origin of SVG: https://www.svgrepo.com/svg/506771/time
 * License: PD License
 * Author Salah Elimam
 * Author website: https://www.figma.com/@salahelimam
 * */
function TimeIcon({ strokeColor }) {
    return (jsx(Fragment, { children: jsxs("svg", { className: "sx__event-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), jsxs("g", { id: "SVGRepo_iconCarrier", children: [jsx("path", { d: "M12 8V12L15 15", stroke: strokeColor, "stroke-width": "2", "stroke-linecap": "round" }), jsx("circle", { cx: "12", cy: "12", r: "9", stroke: strokeColor, "stroke-width": "2" })] })] }) }));
}

/**
 * Origin of SVG: https://www.svgrepo.com/svg/506772/user
 * License: PD License
 * Author Salah Elimam
 * Author website: https://www.figma.com/@salahelimam
 * */
function UserIcon({ strokeColor }) {
    return (jsx(Fragment, { children: jsxs("svg", { className: "sx__event-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), jsxs("g", { id: "SVGRepo_iconCarrier", children: [jsx("path", { d: "M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z", stroke: strokeColor, "stroke-width": "2" }), jsx("path", { d: "M5 19.5C5 15.9101 7.91015 13 11.5 13H12.5C16.0899 13 19 15.9101 19 19.5V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V19.5Z", stroke: strokeColor, "stroke-width": "2" })] })] }) }));
}

const concatenatePeople = (people) => {
    return people.reduce((acc, person, index) => {
        if (index === 0)
            return person;
        if (index === people.length - 1)
            return `${acc} & ${person}`;
        return `${acc}, ${person}`;
    }, '');
};

/**
 * Origin of SVG: https://www.svgrepo.com/svg/489502/location-pin
 * License: PD License
 * Author: Dariush Habibpour
 * Author website: https://redl.ink/dariush/links?ref=svgrepo.com
 * */
function LocationPinIcon({ strokeColor }) {
    return (jsx(Fragment, { children: jsxs("svg", { className: "sx__event-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), jsxs("g", { id: "SVGRepo_iconCarrier", children: [jsxs("g", { "clip-path": "url(#clip0_429_11046)", children: [jsx("rect", { x: "12", y: "11", width: "0.01", height: "0.01", stroke: strokeColor, "stroke-width": "2", "stroke-linejoin": "round" }), jsx("path", { d: "M12 22L17.5 16.5C20.5376 13.4624 20.5376 8.53757 17.5 5.5C14.4624 2.46244 9.53757 2.46244 6.5 5.5C3.46244 8.53757 3.46244 13.4624 6.5 16.5L12 22Z", stroke: strokeColor, "stroke-width": "2", "stroke-linejoin": "round" })] }), jsx("defs", { children: jsx("clipPath", { id: "clip0_429_11046", children: jsx("rect", { width: "24", height: "24", fill: "white" }) }) })] })] }) }));
}

/**
 * Origin of SVG: https://www.svgrepo.com/svg/506838/list
 * License: PD License
 * Author: Salah Elimam
 * Author website: https://www.figma.com/@salahelimam
 * */
function DescriptionIcon({ strokeColor }) {
    return (jsx(Fragment, { children: jsxs("svg", { className: "sx__event-icon", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), jsxs("g", { id: "SVGRepo_iconCarrier", children: [jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3", stroke: strokeColor, "stroke-width": "2" }), jsx("path", { d: "M16 10L8 10", stroke: strokeColor, "stroke-width": "2", "stroke-linecap": "round" }), jsx("path", { d: "M16 14L8 14", stroke: strokeColor, "stroke-width": "2", "stroke-linecap": "round" })] })] }) }));
}

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

const dateFn = (dateTimeString, locale) => {
    const { year, month, date } = toIntegers(dateTimeString);
    return new Date(year, month, date).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};
const timeFn = (dateTimeString, locale) => {
    const { year, month, date, hours, minutes } = toIntegers(dateTimeString);
    return new Date(year, month, date, hours, minutes).toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
    });
};
const getTimeStamp = (calendarEvent, // to facilitate testing. In reality, we will always have a full CalendarEventInternal
locale, delimiter = '\u2013') => {
    const eventTime = { start: calendarEvent.start, end: calendarEvent.end };
    if (calendarEvent._isSingleDayFullDay) {
        return dateFn(eventTime.start, locale);
    }
    if (calendarEvent._isMultiDayFullDay) {
        return `${dateFn(eventTime.start, locale)} ${delimiter} ${dateFn(eventTime.end, locale)}`;
    }
    if (calendarEvent._isSingleDayTimed) {
        return `${dateFn(eventTime.start, locale)} <span aria-hidden="true">⋅</span> ${timeFn(eventTime.start, locale)} ${delimiter} ${timeFn(eventTime.end, locale)}`;
    }
    return `${dateFn(eventTime.start, locale)}, ${timeFn(eventTime.start, locale)} ${delimiter} ${dateFn(eventTime.end, locale)}, ${timeFn(eventTime.end, locale)}`;
};

const useIconColors = ($app) => {
    const ICON_COLOR_LIGHT_MODE = '#000';
    const ICON_COLOR_DARK_MODE = 'var(--sx-color-neutral-variant)';
    const iconColor = signal($app.calendarState.isDark.value
        ? ICON_COLOR_DARK_MODE
        : ICON_COLOR_LIGHT_MODE);
    effect(() => {
        if ($app.calendarState.isDark.value)
            iconColor.value = ICON_COLOR_DARK_MODE;
        else
            iconColor.value = ICON_COLOR_LIGHT_MODE;
    });
    return iconColor;
};

const isScrollable = (el) => {
    if (el) {
        const hasScrollableContent = el.scrollHeight > el.clientHeight;
        const overflowYStyle = window.getComputedStyle(el).overflowY;
        const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;
        return hasScrollableContent && !isOverflowHidden;
    }
    return true;
};
const getScrollableParents = (el, acc = []) => {
    if (!el ||
        el === document.body ||
        el.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        acc.push(window);
        return acc;
    }
    if (isScrollable(el)) {
        acc.push(el);
    }
    return getScrollableParents((el.assignedSlot
        ? el.assignedSlot.parentNode
        : el.parentNode), acc);
};

/**
 * Push a task to the end of the current call stack
 * */
const nextTick = (cb) => {
    setTimeout(() => {
        cb();
    });
};

function EventModal({ $app }) {
    const [modalId] = useState(randomStringId());
    const { value: calendarEvent } = $app.config.plugins.eventModal.calendarEvent;
    const [isDisplayed, setIsDisplayed] = useState(false);
    const customComponent = $app.config._customComponentFns.eventModal;
    const [eventWrapperStyle, setEventWrapperStyle] = useState('sx__event-modal');
    const callSetPosition = () => {
        var _a, _b, _c;
        setPosition((_a = $app.elements.calendarWrapper) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect(), (_b = $app.config.plugins.eventModal) === null || _b === void 0 ? void 0 : _b.calendarEventDOMRect.value, ((_c = $app.elements.calendarWrapper) === null || _c === void 0 ? void 0 : _c.querySelector('.sx__event-modal')).clientHeight);
    };
    const scrollListener = () => {
        var _a, _b;
        $app.config.plugins.eventModal.calendarEventDOMRect.value =
            (_b = (_a = $app.config.plugins.eventModal) === null || _a === void 0 ? void 0 : _a.calendarEventElement.value) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
        callSetPosition();
    };
    useEffect(() => {
        var _a;
        if (customComponent) {
            customComponent(document.querySelector(`[data-ccid=${modalId}]`), {
                calendarEvent: calendarEvent === null || calendarEvent === void 0 ? void 0 : calendarEvent._getExternalEvent(),
            });
        }
        else {
            setEventWrapperStyle(eventWrapperStyle.concat(' sx__event-modal-default'));
        }
        nextTick(() => {
            callSetPosition();
        });
        setIsDisplayed(true);
        const clickOutsideListener = createClickOutsideListener($app, modalId);
        const scrollableAncestors = getScrollableParents(((_a = $app.config.plugins.eventModal) === null || _a === void 0 ? void 0 : _a.calendarEventElement.value) || null);
        scrollableAncestors.forEach((el) => el.addEventListener('scroll', scrollListener));
        document.addEventListener('click', clickOutsideListener);
        return () => {
            document.removeEventListener('click', clickOutsideListener);
            scrollableAncestors.forEach((el) => el.removeEventListener('scroll', scrollListener));
        };
    }, []);
    const iconColor = useIconColors($app);
    return (jsx(Fragment, { children: calendarEvent && (jsx("div", { id: modalId, tabIndex: 0, "data-ccid": modalId, className: `${eventWrapperStyle}${isDisplayed ? ' is-open' : ''}`, children: !customComponent && (jsxs(Fragment, { children: [jsxs("div", { className: "sx__has-icon sx__event-modal__title", children: [jsx("div", { style: {
                                    backgroundColor: `var(--sx-color-${calendarEvent._color}-container)`,
                                }, className: "sx__event-modal__color-icon sx__event-icon" }), calendarEvent.title] }), jsxs("div", { className: "sx__has-icon sx__event-modal__time", children: [jsx(TimeIcon, { strokeColor: iconColor.value }), jsx("div", { dangerouslySetInnerHTML: {
                                    __html: getTimeStamp(calendarEvent, $app.config.locale.value),
                                } })] }), calendarEvent.people && calendarEvent.people.length && (jsxs("div", { className: "sx__has-icon sx__event-modal__people", children: [jsx(UserIcon, { strokeColor: iconColor.value }), concatenatePeople(calendarEvent.people)] })), calendarEvent.location && (jsxs("div", { className: "sx__has-icon sx__event-modal__location", children: [jsx(LocationPinIcon, { strokeColor: iconColor.value }), calendarEvent.location] })), calendarEvent.description && (jsxs("div", { className: "sx__has-icon sx__event-modal__description", children: [jsx(DescriptionIcon, { strokeColor: iconColor.value }), calendarEvent.description] }))] })) })) }));
}

const definePlugin = (name, definition) => {
    definition.name = name;
    return definition;
};

class EventModalPluginImpl {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: PluginName.EventModal
        });
        Object.defineProperty(this, "calendarEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: signal(null)
        });
        Object.defineProperty(this, "calendarEventDOMRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: signal(null)
        });
        Object.defineProperty(this, "calendarEventElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: signal(null)
        });
        Object.defineProperty(this, "ComponentFn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EventModal
        });
    }
    setCalendarEvent(event, eventTargetDOMRect) {
        batch(() => {
            this.calendarEvent.value = event;
            this.calendarEventDOMRect.value = eventTargetDOMRect;
        });
    }
    close() {
        batch(() => {
            this.calendarEvent.value = null;
            this.calendarEventDOMRect.value = null;
        });
    }
}
const createEventModalPlugin = () => {
    return definePlugin('eventModal', new EventModalPluginImpl());
};

export { createEventModalPlugin };
