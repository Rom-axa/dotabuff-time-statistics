import type { VueElement } from "vue";

export default interface LoggerInterface extends VueElement {
    debug(message: string, ...otherParams: any[]): void;

    info(message: string, ...otherParams: any[]): void;

    warn(message: string, ...otherParams: any[]): void;

    error(message: string, ...otherParams: any[]): void;

    success(message: string, ...otherParams: any[]): void;
}