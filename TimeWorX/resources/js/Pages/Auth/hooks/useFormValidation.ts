import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: (value: string) => string | null;
}

export function useFormValidation(initialState: Record<string, string>, validationRules: ValidationRules) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((name: string, value: string) => {
    if (validationRules[name]) {
      const error = validationRules[name](value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error || ''
      }));
      return !error;
    }
    return true;
  }, [validationRules]);

  const validateAll = useCallback((data: Record<string, string>) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(data).forEach(key => {
      if (validationRules[key]) {
        const error = validationRules[key](data[key]);
        newErrors[key] = error || '';
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules]);

  return { errors, validate, validateAll };
}

