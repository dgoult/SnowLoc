import _Vue from 'vue';
import { differenceInYears, lightFormat, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { truncate } from 'lodash';

export function FilterPlugin<T>(Vue: typeof _Vue, options?: T): void {
    const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
    const DEFAULT_TIME_FORMAT = 'hh:mm';
    const DEFAULT_DATE_TIME_FORMAT = 'dd/MM/yyyy hh:mm';
    const DEFAULT_DAY_NAME_FORMAT = 'dddd';
    const DEFAULT_TRUNCATE_MAX_LENGHT = 30;
    const DEFAULT_ROUND_DECIMAL = 2;

    Vue.filter('date', (value: string, pattern: string = DEFAULT_DATE_FORMAT): string => value ? format(parseISO(value), pattern, { locale: fr }) : '');

    Vue.filter('time', (value: string): string => value ? lightFormat(parseISO(value), DEFAULT_TIME_FORMAT) : '');

    Vue.filter('datetime', (value: string): string => value ? lightFormat(parseISO(value), DEFAULT_DATE_TIME_FORMAT) : '');

    Vue.filter('dayname', (value: string): string => value ? format(parseISO(value), DEFAULT_DAY_NAME_FORMAT, { locale: fr }) : '');

    Vue.filter('age', (value: string): string => value ? `${differenceInYears(new Date(), parseISO(value))} ans` : '');

    Vue.filter('truncate', (value: string, maxLength?: number): string => value ? truncate(value, { length: maxLength || DEFAULT_TRUNCATE_MAX_LENGHT }) : '');

    Vue.filter('round', (value: number, decimal: number = DEFAULT_ROUND_DECIMAL): string => value ? value.toFixed(decimal) : '0');
}