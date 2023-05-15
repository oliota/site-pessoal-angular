import { Directive, EventEmitter, forwardRef, Inject, Input, Output, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { ngbAutoClose } from '../util/autoclose';
import { ngbFocusTrap } from '../util/focus-trap';
import { ngbPositioning } from '../util/positioning';
import { NgbDatepicker } from './datepicker';
import { NgbDate } from './ngb-date';
import { NgbInputDatepickerConfig } from './datepicker-input-config';
import { NgbDatepickerConfig } from './datepicker-config';
import { isString } from '../util/util';
import { Subject } from 'rxjs';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
import * as i1 from "./ngb-date-parser-formatter";
import * as i2 from "./ngb-calendar";
import * as i3 from "./adapters/ngb-date-adapter";
import * as i4 from "./datepicker-input-config";
/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
export class NgbInputDatepicker {
    constructor(_parserFormatter, _elRef, _vcRef, _renderer, _ngZone, _calendar, _dateAdapter, _document, _changeDetector, config) {
        this._parserFormatter = _parserFormatter;
        this._elRef = _elRef;
        this._vcRef = _vcRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this._document = _document;
        this._changeDetector = _changeDetector;
        this._cRef = null;
        this._disabled = false;
        this._elWithFocus = null;
        this._model = null;
        this._destroyCloseHandlers$ = new Subject();
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * @since 1.1.1
         */
        this.dateSelect = new EventEmitter();
        /**
         * Event emitted right after the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event fired after closing datepicker window.
         *
         * @since 4.2.0
         */
        this.closed = new EventEmitter();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._validatorChange = () => { };
        ['autoClose', 'container', 'positionTarget', 'placement', 'popperOptions'].forEach((input) => (this[input] = config[input]));
        this._positioning = ngbPositioning();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value === '' || (value && value !== 'false');
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(this._disabled);
        }
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    registerOnValidatorChange(fn) {
        this._validatorChange = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    validate(c) {
        const { value } = c;
        if (value != null) {
            const ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
            if (!ngbDate) {
                return { ngbDate: { invalid: value } };
            }
            if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
                return { ngbDate: { minDate: { minDate: this.minDate, actual: value } } };
            }
            if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
                return { ngbDate: { maxDate: { maxDate: this.maxDate, actual: value } } };
            }
        }
        return null;
    }
    writeValue(value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }
    manualDateChange(value, updateView = false) {
        const inputValueChanged = value !== this._inputValue;
        if (inputValueChanged) {
            this._inputValue = value;
            this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        }
        if (inputValueChanged || !updateView) {
            this._onChange(this._model ? this._dateAdapter.toModel(this._model) : value === '' ? null : value);
        }
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }
    isOpen() {
        return !!this._cRef;
    }
    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     */
    open() {
        if (!this.isOpen()) {
            this._cRef = this._vcRef.createComponent(NgbDatepicker);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
                this._onTouched();
            });
            this._cRef.changeDetectorRef.detectChanges();
            this._cRef.instance.setDisabledState(this.disabled);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }
            // focus handling
            this._elWithFocus = this._document.activeElement;
            ngbFocusTrap(this._ngZone, this._cRef.location.nativeElement, this.closed, true);
            setTimeout(() => this._cRef?.instance.focus());
            let hostElement;
            if (isString(this.positionTarget)) {
                hostElement = this._document.querySelector(this.positionTarget);
            }
            else if (this.positionTarget instanceof HTMLElement) {
                hostElement = this.positionTarget;
            }
            else {
                hostElement = this._elRef.nativeElement;
            }
            // Setting up popper and scheduling updates when zone is stable
            this._ngZone.runOutsideAngular(() => {
                if (this._cRef) {
                    this._positioning.createPopper({
                        hostElement,
                        targetElement: this._cRef.location.nativeElement,
                        placement: this.placement,
                        appendToBody: this.container === 'body',
                        updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 2])(options)),
                    });
                    this._zoneSubscription = this._ngZone.onStable.subscribe(() => this._positioning.update());
                }
            });
            if (this.positionTarget && !hostElement) {
                throw new Error('ngbDatepicker could not find element declared in [positionTarget] to position against.');
            }
            this._setCloseHandlers();
        }
    }
    /**
     * Closes the datepicker popup.
     */
    close() {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this._positioning.destroy();
            this._zoneSubscription?.unsubscribe();
            this._destroyCloseHandlers$.next();
            this.closed.emit();
            this._changeDetector.markForCheck();
            // restore focus
            let elementToFocus = this._elWithFocus;
            if (isString(this.restoreFocus)) {
                elementToFocus = this._document.querySelector(this.restoreFocus);
            }
            else if (this.restoreFocus !== undefined) {
                elementToFocus = this.restoreFocus;
            }
            // in IE document.activeElement can contain an object without 'focus()' sometimes
            if (elementToFocus && elementToFocus['focus']) {
                elementToFocus.focus();
            }
            else {
                this._document.body.focus();
            }
        }
    }
    /**
     * Toggles the datepicker popup.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    navigateTo(date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }
    onBlur() {
        this._onTouched();
    }
    onFocus() {
        this._elWithFocus = this._elRef.nativeElement;
    }
    ngOnChanges(changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
            if (this.isOpen()) {
                if (changes['minDate']) {
                    this._cRef.instance.minDate = this.minDate;
                }
                if (changes['maxDate']) {
                    this._cRef.instance.maxDate = this.maxDate;
                }
                this._cRef.instance.ngOnChanges(changes);
            }
        }
        if (changes['datepickerClass']) {
            const { currentValue, previousValue } = changes['datepickerClass'];
            this._applyPopupClass(currentValue, previousValue);
        }
        if (changes['autoClose'] && this.isOpen()) {
            this._setCloseHandlers();
        }
    }
    ngOnDestroy() {
        this.close();
    }
    _applyDatepickerInputs(datepickerComponentRef) {
        [
            'dayTemplate',
            'dayTemplateData',
            'displayMonths',
            'firstDayOfWeek',
            'footerTemplate',
            'markDisabled',
            'minDate',
            'maxDate',
            'navigation',
            'outsideDays',
            'showNavigation',
            'showWeekNumbers',
            'weekdays',
        ].forEach((inputName) => {
            if (this[inputName] !== undefined) {
                datepickerComponentRef.setInput(inputName, this[inputName]);
            }
        });
        datepickerComponentRef.setInput('startDate', this.startDate || this._model);
    }
    _applyPopupClass(newClass, oldClass) {
        const popupEl = this._cRef?.location.nativeElement;
        if (popupEl) {
            if (newClass) {
                this._renderer.addClass(popupEl, newClass);
            }
            if (oldClass) {
                this._renderer.removeClass(popupEl, oldClass);
            }
        }
    }
    _applyPopupStyling(nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.addClass(nativeElement, 'show');
        if (this.container === 'body') {
            this._renderer.addClass(nativeElement, 'ngb-dp-body');
        }
        this._applyPopupClass(this.datepickerClass);
    }
    _subscribeForDatepickerOutputs(datepickerInstance) {
        datepickerInstance.navigate.subscribe((navigateEvent) => this.navigate.emit(navigateEvent));
        datepickerInstance.dateSelect.subscribe((date) => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }
    _writeModelValue(model) {
        const value = this._parserFormatter.format(model);
        this._inputValue = value;
        this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }
    _fromDateStruct(date) {
        const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    }
    _setCloseHandlers() {
        this._destroyCloseHandlers$.next();
        ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this._destroyCloseHandlers$, [], [this._elRef.nativeElement, this._cRef.location.nativeElement]);
    }
}
NgbInputDatepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbInputDatepicker, deps: [{ token: i1.NgbDateParserFormatter }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: i2.NgbCalendar }, { token: i3.NgbDateAdapter }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i4.NgbInputDatepickerConfig }], target: i0.ɵɵFactoryTarget.Directive });
NgbInputDatepicker.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbInputDatepicker, isStandalone: true, selector: "input[ngbDatepicker]", inputs: { autoClose: "autoClose", datepickerClass: "datepickerClass", dayTemplate: "dayTemplate", dayTemplateData: "dayTemplateData", displayMonths: "displayMonths", firstDayOfWeek: "firstDayOfWeek", footerTemplate: "footerTemplate", markDisabled: "markDisabled", minDate: "minDate", maxDate: "maxDate", navigation: "navigation", outsideDays: "outsideDays", placement: "placement", popperOptions: "popperOptions", restoreFocus: "restoreFocus", showWeekNumbers: "showWeekNumbers", startDate: "startDate", container: "container", positionTarget: "positionTarget", weekdays: "weekdays", disabled: "disabled" }, outputs: { dateSelect: "dateSelect", navigate: "navigate", closed: "closed" }, host: { listeners: { "input": "manualDateChange($event.target.value)", "change": "manualDateChange($event.target.value, true)", "focus": "onFocus()", "blur": "onBlur()" }, properties: { "disabled": "disabled" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
        { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig },
    ], exportAs: ["ngbDatepicker"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbInputDatepicker, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbDatepicker]',
                    exportAs: 'ngbDatepicker',
                    standalone: true,
                    host: {
                        '(input)': 'manualDateChange($event.target.value)',
                        '(change)': 'manualDateChange($event.target.value, true)',
                        '(focus)': 'onFocus()',
                        '(blur)': 'onBlur()',
                        '[disabled]': 'disabled',
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbDateParserFormatter }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i2.NgbCalendar }, { type: i3.NgbDateAdapter }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i4.NgbInputDatepickerConfig }]; }, propDecorators: { autoClose: [{
                type: Input
            }], datepickerClass: [{
                type: Input
            }], dayTemplate: [{
                type: Input
            }], dayTemplateData: [{
                type: Input
            }], displayMonths: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], footerTemplate: [{
                type: Input
            }], markDisabled: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], navigation: [{
                type: Input
            }], outsideDays: [{
                type: Input
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], startDate: [{
                type: Input
            }], container: [{
                type: Input
            }], positionTarget: [{
                type: Input
            }], weekdays: [{
                type: Input
            }], dateSelect: [{
                type: Output
            }], navigate: [{
                type: Output
            }], closed: [{
                type: Output
            }], disabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdOLFNBQVMsRUFFVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBSUwsTUFBTSxHQUtOLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQW9CLE1BQU0saUJBQWlCLENBQUM7QUFDN0QsT0FBTyxFQUdOLGFBQWEsRUFDYixpQkFBaUIsR0FHakIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxjQUFjLEVBQWtCLE1BQU0scUJBQXFCLENBQUM7QUFJckUsT0FBTyxFQUFFLGFBQWEsRUFBOEIsTUFBTSxjQUFjLENBQUM7QUFHekUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUdyQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7QUFFM0Q7Ozs7R0FJRztBQWtCSCxNQUFNLE9BQU8sa0JBQWtCO0lBZ085QixZQUNTLGdCQUF3QyxFQUN4QyxNQUFvQyxFQUNwQyxNQUF3QixFQUN4QixTQUFvQixFQUNwQixPQUFlLEVBQ2YsU0FBc0IsRUFDdEIsWUFBaUMsRUFDZixTQUFj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QUFZO3NCQUFwQixLQUFLO2dCQU9HLE9BQU87c0JBQWYsS0FBSztnQkFPRyxPQUFPO3NCQUFmLEtBQUs7Z0JBU0csVUFBVTtzQkFBbEIsS0FBSztnQkFXRyxXQUFXO3NCQUFuQixLQUFLO2dCQVNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBUUcsYUFBYTtzQkFBckIsS0FBSztnQkFVRyxZQUFZO3NCQUFwQixLQUFLO2dCQUtHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBVUcsU0FBUztzQkFBakIsS0FBSztnQkFPRyxTQUFTO3NCQUFqQixLQUFLO2dCQVNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBV0csUUFBUTtzQkFBaEIsS0FBSztnQkFTSSxVQUFVO3NCQUFuQixNQUFNO2dCQU9HLFFBQVE7c0JBQWpCLE1BQU07Z0JBT0csTUFBTTtzQkFBZixNQUFNO2dCQUdILFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnRSZWYsXG5cdERpcmVjdGl2ZSxcblx0RWxlbWVudFJlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRJbmplY3QsXG5cdElucHV0LFxuXHROZ1pvbmUsXG5cdE9uQ2hhbmdlcyxcblx0T25EZXN0cm95LFxuXHRPdXRwdXQsXG5cdFJlbmRlcmVyMixcblx0U2ltcGxlQ2hhbmdlcyxcblx0VGVtcGxhdGVSZWYsXG5cdFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQsIFRyYW5zbGF0aW9uV2lkdGggfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcblx0QWJzdHJhY3RDb250cm9sLFxuXHRDb250cm9sVmFsdWVBY2Nlc3Nvcixcblx0TkdfVkFMSURBVE9SUyxcblx0TkdfVkFMVUVfQUNDRVNTT1IsXG5cdFZhbGlkYXRpb25FcnJvcnMsXG5cdFZhbGlkYXRvcixcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBuZ2JBdXRvQ2xvc2UgfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQgeyBuZ2JGb2N1c1RyYXAgfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuaW1wb3J0IHsgbmdiUG9zaXRpb25pbmcsIFBsYWNlbWVudEFycmF5IH0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnQHBvcHBlcmpzL2NvcmUnO1xuXG5pbXBvcnQgeyBOZ2JEYXRlQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcnMvbmdiLWRhdGUtYWRhcHRlcic7XG5pbXBvcnQgeyBOZ2JEYXRlcGlja2VyLCBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCB9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQgeyBEYXlUZW1wbGF0ZUNvbnRleHQgfSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuaW1wb3J0IHsgTmdiQ2FsZW5kYXIgfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQgeyBOZ2JEYXRlIH0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQgeyBOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyIH0gZnJvbSAnLi9uZ2ItZGF0ZS1wYXJzZXItZm9ybWF0dGVyJztcbmltcG9ydCB7IE5nYkRhdGVTdHJ1Y3QgfSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQgeyBOZ2JJbnB1dERhdGVwaWNrZXJDb25maWcgfSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtY29uZmlnJztcbmltcG9ydCB7IE5nYkRhdGVwaWNrZXJDb25maWcgfSBmcm9tICcuL2RhdGVwaWNrZXItY29uZmlnJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGFkZFBvcHBlck9mZnNldCB9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmctdXRpbCc7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhbGxvd3MgdG8gc3RpY2sgYSBkYXRlcGlja2VyIHBvcHVwIHRvIGFuIGlucHV0IGZpZWxkLlxuICpcbiAqIE1hbmFnZXMgaW50ZXJhY3Rpb24gd2l0aCB0aGUgaW5wdXQgZmllbGQgaXRzZWxmLCBkb2VzIHZhbHVlIGZvcm1hdHRpbmcgYW5kIHByb3ZpZGVzIGZvcm1zIGludGVncmF0aW9uLlxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdpbnB1dFtuZ2JEYXRlcGlja2VyXScsXG5cdGV4cG9ydEFzOiAnbmdiRGF0ZXBpY2tlcicsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHQnKGlucHV0KSc6ICdtYW51YWxEYXRlQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcblx0XHQnKGNoYW5nZSknOiAnbWFudWFsRGF0ZUNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlLCB0cnVlKScsXG5cdFx0Jyhmb2N1cyknOiAnb25Gb2N1cygpJyxcblx0XHQnKGJsdXIpJzogJ29uQmx1cigpJyxcblx0XHQnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG5cdH0sXG5cdHByb3ZpZGVyczogW1xuXHRcdHsgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYklucHV0RGF0ZXBpY2tlciksIG11bHRpOiB0cnVlIH0sXG5cdFx0eyBwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JJbnB1dERhdGVwaWNrZXIpLCBtdWx0aTogdHJ1ZSB9LFxuXHRcdHsgcHJvdmlkZTogTmdiRGF0ZXBpY2tlckNvbmZpZywgdXNlRXhpc3Rpbmc6IE5nYklucHV0RGF0ZXBpY2tlckNvbmZpZyB9LFxuXHRdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JJbnB1dERhdGVwaWNrZXIgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvQ2xvc2U6IGJvb2xlYW4gfCBzdHJpbmc7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8ICcnO1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbmF2aWdhdGlvbjogc3RyaW5nO1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3V0c2lkZURheXM6IHN0cmluZztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3dlZWtkYXlzOiBib29sZWFuIHwgbnVtYmVyO1xuXG5cdHByaXZhdGUgX2NSZWY6IENvbXBvbmVudFJlZjxOZ2JEYXRlcGlja2VyPiB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXHRwcml2YXRlIF9lbFdpdGhGb2N1czogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfbW9kZWw6IE5nYkRhdGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfaW5wdXRWYWx1ZTogc3RyaW5nO1xuXHRwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBhbnk7XG5cdHByaXZhdGUgX3Bvc2l0aW9uaW5nOiBSZXR1cm5UeXBlPHR5cGVvZiBuZ2JQb3NpdGlvbmluZz47XG5cdHByaXZhdGUgX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcHVwIHNob3VsZCBiZSBjbG9zZWQgYXV0b21hdGljYWxseSBhZnRlciBkYXRlIHNlbGVjdGlvbiAvIG91dHNpZGUgY2xpY2sgb3Igbm90LlxuXHQgKlxuXHQgKiAqIGB0cnVlYCAtIHRoZSBwb3B1cCB3aWxsIGNsb3NlIG9uIGJvdGggZGF0ZSBzZWxlY3Rpb24gYW5kIG91dHNpZGUgY2xpY2suXG5cdCAqICogYGZhbHNlYCAtIHRoZSBwb3B1cCBjYW4gb25seSBiZSBjbG9zZWQgbWFudWFsbHkgdmlhIGBjbG9zZSgpYCBvciBgdG9nZ2xlKClgIG1ldGhvZHMuXG5cdCAqICogYFwiaW5zaWRlXCJgIC0gdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb24gZGF0ZSBzZWxlY3Rpb24sIGJ1dCBub3Qgb3V0c2lkZSBjbGlja3MuXG5cdCAqICogYFwib3V0c2lkZVwiYCAtIHRoZSBwb3B1cCB3aWxsIGNsb3NlIG9ubHkgb24gdGhlIG91dHNpZGUgY2xpY2sgYW5kIG5vdCBvbiBkYXRlIHNlbGVjdGlvbi9pbnNpZGUgY2xpY2tzLlxuXHQgKlxuXHQgKiBAc2luY2UgMy4wLjBcblx0ICovXG5cdEBJbnB1dCgpIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdpbnNpZGUnIHwgJ291dHNpZGUnO1xuXG5cdC8qKlxuXHQgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIHRoZSBkYXRlcGlja2VyIHBvcHVwIGVsZW1lbnQuXG5cdCAqXG5cdCAqIEBzaW5jZSA5LjEuMFxuXHQgKi9cblx0QElucHV0KCkgZGF0ZXBpY2tlckNsYXNzOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSByZWZlcmVuY2UgdG8gYSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBkYXkuXG5cdCAqXG5cdCAqIEFsbG93cyB0byBjb21wbGV0ZWx5IG92ZXJyaWRlIHRoZSB3YXkgYSBkYXkgJ2NlbGwnIGluIHRoZSBjYWxlbmRhciBpcyBkaXNwbGF5ZWQuXG5cdCAqXG5cdCAqIFNlZSBbYERheVRlbXBsYXRlQ29udGV4dGBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNEYXlUZW1wbGF0ZUNvbnRleHQpIGZvciB0aGUgZGF0YSB5b3UgZ2V0IGluc2lkZS5cblx0ICovXG5cdEBJbnB1dCgpIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuXG5cdC8qKlxuXHQgKiBUaGUgY2FsbGJhY2sgdG8gcGFzcyBhbnkgYXJiaXRyYXJ5IGRhdGEgdG8gdGhlIHRlbXBsYXRlIGNlbGwgdmlhIHRoZVxuXHQgKiBbYERheVRlbXBsYXRlQ29udGV4dGBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNEYXlUZW1wbGF0ZUNvbnRleHQpJ3MgYGRhdGFgIHBhcmFtZXRlci5cblx0ICpcblx0ICogYGN1cnJlbnRgIGlzIHRoZSBtb250aCB0aGF0IGlzIGN1cnJlbnRseSBkaXNwbGF5ZWQgYnkgdGhlIGRhdGVwaWNrZXIuXG5cdCAqXG5cdCAqIEBzaW5jZSAzLjMuMFxuXHQgKi9cblx0QElucHV0KCkgZGF5VGVtcGxhdGVEYXRhOiAoZGF0ZTogTmdiRGF0ZSwgY3VycmVudD86IHsgeWVhcjogbnVtYmVyOyBtb250aDogbnVtYmVyIH0pID0+IGFueTtcblxuXHQvKipcblx0ICogVGhlIG51bWJlciBvZiBtb250aHMgdG8gZGlzcGxheS5cblx0ICovXG5cdEBJbnB1dCgpIGRpc3BsYXlNb250aHM6IG51bWJlcjtcblxuXHQvKipcblx0ICogVGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cblx0ICpcblx0ICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ3dlZWtkYXknIGlzIDE9TW9uIC4uLiA3PVN1bi5cblx0ICovXG5cdEBJbnB1dCgpIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRoZSByZWZlcmVuY2UgdG8gdGhlIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGRhdGVwaWNrZXIgZm9vdGVyLlxuXHQgKlxuXHQgKiBAc2luY2UgMy4zLjBcblx0ICovXG5cdEBJbnB1dCgpIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG5cdC8qKlxuXHQgKiBUaGUgY2FsbGJhY2sgdG8gbWFyayBzb21lIGRhdGVzIGFzIGRpc2FibGVkLlxuXHQgKlxuXHQgKiBJdCBpcyBjYWxsZWQgZm9yIGVhY2ggbmV3IGRhdGUgd2hlbiBuYXZpZ2F0aW5nIHRvIGEgZGlmZmVyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiBgY3VycmVudGAgaXMgdGhlIG1vbnRoIHRoYXQgaXMgY3VycmVudGx5IGRpc3BsYXllZCBieSB0aGUgZGF0ZXBpY2tlci5cblx0ICovXG5cdEBJbnB1dCgpIG1hcmtEaXNhYmxlZDogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ/OiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlciB9KSA9PiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBUaGUgZWFybGllc3QgZGF0ZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb3Igc2VsZWN0ZWQuIEFsc28gdXNlZCBmb3IgZm9ybSB2YWxpZGF0aW9uLlxuXHQgKlxuXHQgKiBJZiBub3QgcHJvdmlkZWQsICd5ZWFyJyBzZWxlY3QgYm94IHdpbGwgZGlzcGxheSAxMCB5ZWFycyBiZWZvcmUgdGhlIGN1cnJlbnQgbW9udGguXG5cdCAqL1xuXHRASW5wdXQoKSBtaW5EYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG5cdC8qKlxuXHQgKiBUaGUgbGF0ZXN0IGRhdGUgdGhhdCBjYW4gYmUgZGlzcGxheWVkIG9yIHNlbGVjdGVkLiBBbHNvIHVzZWQgZm9yIGZvcm0gdmFsaWRhdGlvbi5cblx0ICpcblx0ICogSWYgbm90IHByb3ZpZGVkLCAneWVhcicgc2VsZWN0IGJveCB3aWxsIGRpc3BsYXkgMTAgeWVhcnMgYWZ0ZXIgdGhlIGN1cnJlbnQgbW9udGguXG5cdCAqL1xuXHRASW5wdXQoKSBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0aW9uIHR5cGUuXG5cdCAqXG5cdCAqICogYFwic2VsZWN0XCJgIC0gc2VsZWN0IGJveGVzIGZvciBtb250aCBhbmQgbmF2aWdhdGlvbiBhcnJvd3Ncblx0ICogKiBgXCJhcnJvd3NcImAgLSBvbmx5IG5hdmlnYXRpb24gYXJyb3dzXG5cdCAqICogYFwibm9uZVwiYCAtIG5vIG5hdmlnYXRpb24gdmlzaWJsZSBhdCBhbGxcblx0ICovXG5cdEBJbnB1dCgpIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZSc7XG5cblx0LyoqXG5cdCAqIFRoZSB3YXkgb2YgZGlzcGxheWluZyBkYXlzIHRoYXQgZG9uJ3QgYmVsb25nIHRvIHRoZSBjdXJyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiAqIGBcInZpc2libGVcImAgLSBkYXlzIGFyZSB2aXNpYmxlXG5cdCAqICogYFwiaGlkZGVuXCJgIC0gZGF5cyBhcmUgaGlkZGVuLCB3aGl0ZSBzcGFjZSBwcmVzZXJ2ZWRcblx0ICogKiBgXCJjb2xsYXBzZWRcImAgLSBkYXlzIGFyZSBjb2xsYXBzZWQsIHNvIHRoZSBkYXRlcGlja2VyIGhlaWdodCBtaWdodCBjaGFuZ2UgYmV0d2VlbiBtb250aHNcblx0ICpcblx0ICogRm9yIHRoZSAyKyBtb250aHMgdmlldywgZGF5cyBpbiBiZXR3ZWVuIG1vbnRocyBhcmUgbmV2ZXIgc2hvd24uXG5cdCAqL1xuXHRASW5wdXQoKSBvdXRzaWRlRGF5czogJ3Zpc2libGUnIHwgJ2NvbGxhcHNlZCcgfCAnaGlkZGVuJztcblxuXHQvKipcblx0ICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIGRhdGVwaWNrZXIgcG9wdXAsIGFtb25nIHRoZSBbcG9zc2libGUgdmFsdWVzXSgjL2d1aWRlcy9wb3NpdGlvbmluZyNhcGkpLlxuXHQgKlxuXHQgKiBUaGUgZGVmYXVsdCBvcmRlciBvZiBwcmVmZXJlbmNlIGlzIGBcImJvdHRvbS1zdGFydCBib3R0b20tZW5kIHRvcC1zdGFydCB0b3AtZW5kXCJgXG5cdCAqXG5cdCAqIFBsZWFzZSBzZWUgdGhlIFtwb3NpdGlvbmluZyBvdmVydmlld10oIy9wb3NpdGlvbmluZykgZm9yIG1vcmUgZGV0YWlscy5cblx0ICovXG5cdEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG5cblx0LyoqXG5cdCAqIEFsbG93cyB0byBjaGFuZ2UgZGVmYXVsdCBQb3BwZXIgb3B0aW9ucyB3aGVuIHBvc2l0aW9uaW5nIHRoZSBwb3B1cC5cblx0ICogUmVjZWl2ZXMgY3VycmVudCBwb3BwZXIgb3B0aW9ucyBhbmQgcmV0dXJucyBtb2RpZmllZCBvbmVzLlxuXHQgKlxuXHQgKiBAc2luY2UgMTMuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3BwZXJPcHRpb25zOiAob3B0aW9uczogUGFydGlhbDxPcHRpb25zPikgPT4gUGFydGlhbDxPcHRpb25zPjtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aGVuIGNsb3NpbmcgZGF0ZXBpY2tlciB3aWxsIGZvY3VzIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgZGF0ZXBpY2tlciB3YXMgb3BlbmVkLlxuXHQgKlxuXHQgKiBBbHRlcm5hdGl2ZWx5IHlvdSBjb3VsZCBwcm92aWRlIGEgc2VsZWN0b3Igb3IgYW4gYEhUTUxFbGVtZW50YCB0byBmb2N1cy4gSWYgdGhlIGVsZW1lbnQgZG9lc24ndCBleGlzdCBvciBpbnZhbGlkLFxuXHQgKiB3ZSdsbCBmYWxsYmFjayB0byBmb2N1cyBkb2N1bWVudCBib2R5LlxuXHQgKlxuXHQgKiBAc2luY2UgNS4yLjBcblx0ICovXG5cdEBJbnB1dCgpIHJlc3RvcmVGb2N1czogdHJ1ZSB8IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHdlZWsgbnVtYmVycyB3aWxsIGJlIGRpc3BsYXllZC5cblx0ICovXG5cdEBJbnB1dCgpIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIGRhdGUgdG8gb3BlbiBjYWxlbmRhciB3aXRoLlxuXHQgKlxuXHQgKiBXaXRoIHRoZSBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbiAuLi4gMTI9RGVjLlxuXHQgKiBJZiBub3RoaW5nIG9yIGludmFsaWQgZGF0ZSBpcyBwcm92aWRlZCwgY2FsZW5kYXIgd2lsbCBvcGVuIHdpdGggY3VycmVudCBtb250aC5cblx0ICpcblx0ICogWW91IGNvdWxkIHVzZSBgbmF2aWdhdGVUbyhkYXRlKWAgbWV0aG9kIGFzIGFuIGFsdGVybmF0aXZlLlxuXHQgKi9cblx0QElucHV0KCkgc3RhcnREYXRlOiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlcjsgZGF5PzogbnVtYmVyIH07XG5cblx0LyoqXG5cdCAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgZGF0ZXBpY2tlciBwb3B1cCBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG5cdCAqXG5cdCAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIGBcImJvZHlcImAuXG5cdCAqL1xuXHRASW5wdXQoKSBjb250YWluZXI6IHN0cmluZztcblxuXHQvKipcblx0ICogQSBjc3Mgc2VsZWN0b3Igb3IgaHRtbCBlbGVtZW50IHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIHBvc2l0aW9uZWQgYWdhaW5zdC5cblx0ICpcblx0ICogQnkgZGVmYXVsdCB0aGUgaW5wdXQgaXMgdXNlZCBhcyBhIHRhcmdldC5cblx0ICpcblx0ICogQHNpbmNlIDQuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3NpdGlvblRhcmdldDogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG5cblx0LyoqXG5cdCAqIFRoZSB3YXkgd2Vla2RheXMgc2hvdWxkIGJlIGRpc3BsYXllZC5cblx0ICpcblx0ICogKiBgdHJ1ZWAgLSB3ZWVrZGF5cyBhcmUgZGlzcGxheWVkIHVzaW5nIGRlZmF1bHQgd2lkdGhcblx0ICogKiBgZmFsc2VgIC0gd2Vla2RheXMgYXJlIG5vdCBkaXNwbGF5ZWRcblx0ICogKiBgVHJhbnNsYXRpb25XaWR0aGAgLSB3ZWVrZGF5cyBhcmUgZGlzcGxheWVkIHVzaW5nIHNwZWNpZmllZCB3aWR0aFxuXHQgKlxuXHQgKiBAc2luY2UgOS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHdlZWtkYXlzOiBUcmFuc2xhdGlvbldpZHRoIHwgYm9vbGVhbjtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHVzZXIgc2VsZWN0cyBhIGRhdGUgdXNpbmcga2V5Ym9hcmQgb3IgbW91c2UuXG5cdCAqXG5cdCAqIFRoZSBwYXlsb2FkIG9mIHRoZSBldmVudCBpcyBjdXJyZW50bHkgc2VsZWN0ZWQgYE5nYkRhdGVgLlxuXHQgKlxuXHQgKiBAc2luY2UgMS4xLjFcblx0ICovXG5cdEBPdXRwdXQoKSBkYXRlU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlPigpO1xuXG5cdC8qKlxuXHQgKiBFdmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBuYXZpZ2F0aW9uIGhhcHBlbnMgYW5kIGRpc3BsYXllZCBtb250aCBjaGFuZ2VzLlxuXHQgKlxuXHQgKiBTZWUgW2BOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudGBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCkgZm9yIHRoZSBwYXlsb2FkIGluZm8uXG5cdCAqL1xuXHRAT3V0cHV0KCkgbmF2aWdhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50PigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBmaXJlZCBhZnRlciBjbG9zaW5nIGRhdGVwaWNrZXIgd2luZG93LlxuXHQgKlxuXHQgKiBAc2luY2UgNC4yLjBcblx0ICovXG5cdEBPdXRwdXQoKSBjbG9zZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0QElucHV0KClcblx0Z2V0IGRpc2FibGVkKCkge1xuXHRcdHJldHVybiB0aGlzLl9kaXNhYmxlZDtcblx0fVxuXHRzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuXHRcdHRoaXMuX2Rpc2FibGVkID0gdmFsdWUgPT09ICcnIHx8ICh2YWx1ZSAmJiB2YWx1ZSAhPT0gJ2ZhbHNlJyk7XG5cblx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5fY1JlZiEuaW5zdGFuY2Uuc2V0RGlzYWJsZWRTdGF0ZSh0aGlzLl9kaXNhYmxlZCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcblx0cHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cdHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9ICgpID0+IHt9O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgX3BhcnNlckZvcm1hdHRlcjogTmdiRGF0ZVBhcnNlckZvcm1hdHRlcixcblx0XHRwcml2YXRlIF9lbFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50Pixcblx0XHRwcml2YXRlIF92Y1JlZjogVmlld0NvbnRhaW5lclJlZixcblx0XHRwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuXHRcdHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuXHRcdHByaXZhdGUgX2NhbGVuZGFyOiBOZ2JDYWxlbmRhcixcblx0XHRwcml2YXRlIF9kYXRlQWRhcHRlcjogTmdiRGF0ZUFkYXB0ZXI8YW55Pixcblx0XHRASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuXHRcdHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcblx0XHRjb25maWc6IE5nYklucHV0RGF0ZXBpY2tlckNvbmZpZyxcblx0KSB7XG5cdFx0WydhdXRvQ2xvc2UnLCAnY29udGFpbmVyJywgJ3Bvc2l0aW9uVGFyZ2V0JywgJ3BsYWNlbWVudCcsICdwb3BwZXJPcHRpb25zJ10uZm9yRWFjaChcblx0XHRcdChpbnB1dCkgPT4gKHRoaXNbaW5wdXRdID0gY29uZmlnW2lucHV0XSksXG5cdFx0KTtcblx0XHR0aGlzLl9wb3NpdGlvbmluZyA9IG5nYlBvc2l0aW9uaW5nKCk7XG5cdH1cblxuXHRyZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7XG5cdFx0dGhpcy5fb25DaGFuZ2UgPSBmbjtcblx0fVxuXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHtcblx0XHR0aGlzLl9vblRvdWNoZWQgPSBmbjtcblx0fVxuXG5cdHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcblx0XHR0aGlzLl92YWxpZGF0b3JDaGFuZ2UgPSBmbjtcblx0fVxuXG5cdHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuXHRcdHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuXHR9XG5cblx0dmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuXHRcdGNvbnN0IHsgdmFsdWUgfSA9IGM7XG5cblx0XHRpZiAodmFsdWUgIT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgbmdiRGF0ZSA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX2RhdGVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSkpO1xuXG5cdFx0XHRpZiAoIW5nYkRhdGUpIHtcblx0XHRcdFx0cmV0dXJuIHsgbmdiRGF0ZTogeyBpbnZhbGlkOiB2YWx1ZSB9IH07XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm1pbkRhdGUgJiYgbmdiRGF0ZS5iZWZvcmUoTmdiRGF0ZS5mcm9tKHRoaXMubWluRGF0ZSkpKSB7XG5cdFx0XHRcdHJldHVybiB7IG5nYkRhdGU6IHsgbWluRGF0ZTogeyBtaW5EYXRlOiB0aGlzLm1pbkRhdGUsIGFjdHVhbDogdmFsdWUgfSB9IH07XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm1heERhdGUgJiYgbmdiRGF0ZS5hZnRlcihOZ2JEYXRlLmZyb20odGhpcy5tYXhEYXRlKSkpIHtcblx0XHRcdFx0cmV0dXJuIHsgbmdiRGF0ZTogeyBtYXhEYXRlOiB7IG1heERhdGU6IHRoaXMubWF4RGF0ZSwgYWN0dWFsOiB2YWx1ZSB9IH0gfTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHdyaXRlVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLl9tb2RlbCA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX2RhdGVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSkpO1xuXHRcdHRoaXMuX3dyaXRlTW9kZWxWYWx1ZSh0aGlzLl9tb2RlbCk7XG5cdH1cblxuXHRtYW51YWxEYXRlQ2hhbmdlKHZhbHVlOiBzdHJpbmcsIHVwZGF0ZVZpZXcgPSBmYWxzZSkge1xuXHRcdGNvbnN0IGlucHV0VmFsdWVDaGFuZ2VkID0gdmFsdWUgIT09IHRoaXMuX2lucHV0VmFsdWU7XG5cdFx0aWYgKGlucHV0VmFsdWVDaGFuZ2VkKSB7XG5cdFx0XHR0aGlzLl9pbnB1dFZhbHVlID0gdmFsdWU7XG5cdFx0XHR0aGlzLl9tb2RlbCA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX3BhcnNlckZvcm1hdHRlci5wYXJzZSh2YWx1ZSkpO1xuXHRcdH1cblx0XHRpZiAoaW5wdXRWYWx1ZUNoYW5nZWQgfHwgIXVwZGF0ZVZpZXcpIHtcblx0XHRcdHRoaXMuX29uQ2hhbmdlKHRoaXMuX21vZGVsID8gdGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkgOiB2YWx1ZSA9PT0gJycgPyBudWxsIDogdmFsdWUpO1xuXHRcdH1cblx0XHRpZiAodXBkYXRlVmlldyAmJiB0aGlzLl9tb2RlbCkge1xuXHRcdFx0dGhpcy5fd3JpdGVNb2RlbFZhbHVlKHRoaXMuX21vZGVsKTtcblx0XHR9XG5cdH1cblxuXHRpc09wZW4oKSB7XG5cdFx0cmV0dXJuICEhdGhpcy5fY1JlZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVucyB0aGUgZGF0ZXBpY2tlciBwb3B1cC5cblx0ICpcblx0ICogSWYgdGhlIHJlbGF0ZWQgZm9ybSBjb250cm9sIGNvbnRhaW5zIGEgdmFsaWQgZGF0ZSwgdGhlIGNvcnJlc3BvbmRpbmcgbW9udGggd2lsbCBiZSBvcGVuZWQuXG5cdCAqL1xuXHRvcGVuKCkge1xuXHRcdGlmICghdGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5fY1JlZiA9IHRoaXMuX3ZjUmVmLmNyZWF0ZUNvbXBvbmVudChOZ2JEYXRlcGlja2VyKTtcblxuXHRcdFx0dGhpcy5fYXBwbHlQb3B1cFN0eWxpbmcodGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcblx0XHRcdHRoaXMuX2FwcGx5RGF0ZXBpY2tlcklucHV0cyh0aGlzLl9jUmVmKTtcblx0XHRcdHRoaXMuX3N1YnNjcmliZUZvckRhdGVwaWNrZXJPdXRwdXRzKHRoaXMuX2NSZWYuaW5zdGFuY2UpO1xuXHRcdFx0dGhpcy5fY1JlZi5pbnN0YW5jZS5uZ09uSW5pdCgpO1xuXHRcdFx0dGhpcy5fY1JlZi5pbnN0YW5jZS53cml0ZVZhbHVlKHRoaXMuX2RhdGVBZGFwdGVyLnRvTW9kZWwodGhpcy5fbW9kZWwpKTtcblxuXHRcdFx0Ly8gZGF0ZSBzZWxlY3Rpb24gZXZlbnQgaGFuZGxpbmdcblx0XHRcdHRoaXMuX2NSZWYuaW5zdGFuY2UucmVnaXN0ZXJPbkNoYW5nZSgoc2VsZWN0ZWREYXRlKSA9PiB7XG5cdFx0XHRcdHRoaXMud3JpdGVWYWx1ZShzZWxlY3RlZERhdGUpO1xuXHRcdFx0XHR0aGlzLl9vbkNoYW5nZShzZWxlY3RlZERhdGUpO1xuXHRcdFx0XHR0aGlzLl9vblRvdWNoZWQoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLl9jUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuXHRcdFx0dGhpcy5fY1JlZi5pbnN0YW5jZS5zZXREaXNhYmxlZFN0YXRlKHRoaXMuZGlzYWJsZWQpO1xuXG5cdFx0XHRpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuXHRcdFx0XHR0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmb2N1cyBoYW5kbGluZ1xuXHRcdFx0dGhpcy5fZWxXaXRoRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdFx0bmdiRm9jdXNUcmFwKHRoaXMuX25nWm9uZSwgdGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLmNsb3NlZCwgdHJ1ZSk7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMuX2NSZWY/Lmluc3RhbmNlLmZvY3VzKCkpO1xuXG5cdFx0XHRsZXQgaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXHRcdFx0aWYgKGlzU3RyaW5nKHRoaXMucG9zaXRpb25UYXJnZXQpKSB7XG5cdFx0XHRcdGhvc3RFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnBvc2l0aW9uVGFyZ2V0KTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5wb3NpdGlvblRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdFx0XHRcdGhvc3RFbGVtZW50ID0gdGhpcy5wb3NpdGlvblRhcmdldDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhvc3RFbGVtZW50ID0gdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0dGluZyB1cCBwb3BwZXIgYW5kIHNjaGVkdWxpbmcgdXBkYXRlcyB3aGVuIHpvbmUgaXMgc3RhYmxlXG5cdFx0XHR0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5fY1JlZikge1xuXHRcdFx0XHRcdHRoaXMuX3Bvc2l0aW9uaW5nLmNyZWF0ZVBvcHBlcih7XG5cdFx0XHRcdFx0XHRob3N0RWxlbWVudCxcblx0XHRcdFx0XHRcdHRhcmdldEVsZW1lbnQ6IHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XHRcdHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG5cdFx0XHRcdFx0XHRhcHBlbmRUb0JvZHk6IHRoaXMuY29udGFpbmVyID09PSAnYm9keScsXG5cdFx0XHRcdFx0XHR1cGRhdGVQb3BwZXJPcHRpb25zOiAob3B0aW9ucykgPT4gdGhpcy5wb3BwZXJPcHRpb25zKGFkZFBvcHBlck9mZnNldChbMCwgMl0pKG9wdGlvbnMpKSxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHRoaXMuX3pvbmVTdWJzY3JpcHRpb24gPSB0aGlzLl9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHRoaXMuX3Bvc2l0aW9uaW5nLnVwZGF0ZSgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmICh0aGlzLnBvc2l0aW9uVGFyZ2V0ICYmICFob3N0RWxlbWVudCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ25nYkRhdGVwaWNrZXIgY291bGQgbm90IGZpbmQgZWxlbWVudCBkZWNsYXJlZCBpbiBbcG9zaXRpb25UYXJnZXRdIHRvIHBvc2l0aW9uIGFnYWluc3QuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuXHQgKi9cblx0Y2xvc2UoKSB7XG5cdFx0aWYgKHRoaXMuaXNPcGVuKCkpIHtcblx0XHRcdHRoaXMuX3ZjUmVmLnJlbW92ZSh0aGlzLl92Y1JlZi5pbmRleE9mKHRoaXMuX2NSZWYhLmhvc3RWaWV3KSk7XG5cdFx0XHR0aGlzLl9jUmVmID0gbnVsbDtcblx0XHRcdHRoaXMuX3Bvc2l0aW9uaW5nLmRlc3Ryb3koKTtcblx0XHRcdHRoaXMuX3pvbmVTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG5cdFx0XHR0aGlzLl9kZXN0cm95Q2xvc2VIYW5kbGVycyQubmV4dCgpO1xuXHRcdFx0dGhpcy5jbG9zZWQuZW1pdCgpO1xuXHRcdFx0dGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG5cblx0XHRcdC8vIHJlc3RvcmUgZm9jdXNcblx0XHRcdGxldCBlbGVtZW50VG9Gb2N1czogSFRNTEVsZW1lbnQgfCBudWxsID0gdGhpcy5fZWxXaXRoRm9jdXM7XG5cdFx0XHRpZiAoaXNTdHJpbmcodGhpcy5yZXN0b3JlRm9jdXMpKSB7XG5cdFx0XHRcdGVsZW1lbnRUb0ZvY3VzID0gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnJlc3RvcmVGb2N1cyk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMucmVzdG9yZUZvY3VzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0ZWxlbWVudFRvRm9jdXMgPSB0aGlzLnJlc3RvcmVGb2N1cyBhcyBIVE1MRWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaW4gSUUgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBjYW4gY29udGFpbiBhbiBvYmplY3Qgd2l0aG91dCAnZm9jdXMoKScgc29tZXRpbWVzXG5cdFx0XHRpZiAoZWxlbWVudFRvRm9jdXMgJiYgZWxlbWVudFRvRm9jdXNbJ2ZvY3VzJ10pIHtcblx0XHRcdFx0ZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX2RvY3VtZW50LmJvZHkuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyB0aGUgZGF0ZXBpY2tlciBwb3B1cC5cblx0ICovXG5cdHRvZ2dsZSgpIHtcblx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9wZW4oKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGVzIHRvIHRoZSBwcm92aWRlZCBkYXRlLlxuXHQgKlxuXHQgKiBXaXRoIHRoZSBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbiAuLi4gMTI9RGVjLlxuXHQgKiBJZiBub3RoaW5nIG9yIGludmFsaWQgZGF0ZSBwcm92aWRlZCBjYWxlbmRhciB3aWxsIG9wZW4gY3VycmVudCBtb250aC5cblx0ICpcblx0ICogVXNlIHRoZSBgW3N0YXJ0RGF0ZV1gIGlucHV0IGFzIGFuIGFsdGVybmF0aXZlLlxuXHQgKi9cblx0bmF2aWdhdGVUbyhkYXRlPzogeyB5ZWFyOiBudW1iZXI7IG1vbnRoOiBudW1iZXI7IGRheT86IG51bWJlciB9KSB7XG5cdFx0aWYgKHRoaXMuaXNPcGVuKCkpIHtcblx0XHRcdHRoaXMuX2NSZWYhLmluc3RhbmNlLm5hdmlnYXRlVG8oZGF0ZSk7XG5cdFx0fVxuXHR9XG5cblx0b25CbHVyKCkge1xuXHRcdHRoaXMuX29uVG91Y2hlZCgpO1xuXHR9XG5cblx0b25Gb2N1cygpIHtcblx0XHR0aGlzLl9lbFdpdGhGb2N1cyA9IHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQ7XG5cdH1cblxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG5cdFx0aWYgKGNoYW5nZXNbJ21pbkRhdGUnXSB8fCBjaGFuZ2VzWydtYXhEYXRlJ10pIHtcblx0XHRcdHRoaXMuX3ZhbGlkYXRvckNoYW5nZSgpO1xuXG5cdFx0XHRpZiAodGhpcy5pc09wZW4oKSkge1xuXHRcdFx0XHRpZiAoY2hhbmdlc1snbWluRGF0ZSddKSB7XG5cdFx0XHRcdFx0dGhpcy5fY1JlZiEuaW5zdGFuY2UubWluRGF0ZSA9IHRoaXMubWluRGF0ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2hhbmdlc1snbWF4RGF0ZSddKSB7XG5cdFx0XHRcdFx0dGhpcy5fY1JlZiEuaW5zdGFuY2UubWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jUmVmIS5pbnN0YW5jZS5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoY2hhbmdlc1snZGF0ZXBpY2tlckNsYXNzJ10pIHtcblx0XHRcdGNvbnN0IHsgY3VycmVudFZhbHVlLCBwcmV2aW91c1ZhbHVlIH0gPSBjaGFuZ2VzWydkYXRlcGlja2VyQ2xhc3MnXTtcblx0XHRcdHRoaXMuX2FwcGx5UG9wdXBDbGFzcyhjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWUpO1xuXHRcdH1cblxuXHRcdGlmIChjaGFuZ2VzWydhdXRvQ2xvc2UnXSAmJiB0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHR0aGlzLl9zZXRDbG9zZUhhbmRsZXJzKCk7XG5cdFx0fVxuXHR9XG5cblx0bmdPbkRlc3Ryb3koKSB7XG5cdFx0dGhpcy5jbG9zZSgpO1xuXHR9XG5cblx0cHJpdmF0ZSBfYXBwbHlEYXRlcGlja2VySW5wdXRzKGRhdGVwaWNrZXJDb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxOZ2JEYXRlcGlja2VyPik6IHZvaWQge1xuXHRcdFtcblx0XHRcdCdkYXlUZW1wbGF0ZScsXG5cdFx0XHQnZGF5VGVtcGxhdGVEYXRhJyxcblx0XHRcdCdkaXNwbGF5TW9udGhzJyxcblx0XHRcdCdmaXJzdERheU9mV2VlaycsXG5cdFx0XHQnZm9vdGVyVGVtcGxhdGUnLFxuXHRcdFx0J21hcmtEaXNhYmxlZCcsXG5cdFx0XHQnbWluRGF0ZScsXG5cdFx0XHQnbWF4RGF0ZScsXG5cdFx0XHQnbmF2aWdhdGlvbicsXG5cdFx0XHQnb3V0c2lkZURheXMnLFxuXHRcdFx0J3Nob3dOYXZpZ2F0aW9uJyxcblx0XHRcdCdzaG93V2Vla051bWJlcnMnLFxuXHRcdFx0J3dlZWtkYXlzJyxcblx0XHRdLmZvckVhY2goKGlucHV0TmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAodGhpc1tpbnB1dE5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0ZGF0ZXBpY2tlckNvbXBvbmVudFJlZi5zZXRJbnB1dChpbnB1dE5hbWUsIHRoaXNbaW5wdXROYW1lXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0ZGF0ZXBpY2tlckNvbXBvbmVudFJlZi5zZXRJbnB1dCgnc3RhcnREYXRlJywgdGhpcy5zdGFydERhdGUgfHwgdGhpcy5fbW9kZWwpO1xuXHR9XG5cblx0cHJpdmF0ZSBfYXBwbHlQb3B1cENsYXNzKG5ld0NsYXNzOiBzdHJpbmcsIG9sZENsYXNzPzogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcG9wdXBFbCA9IHRoaXMuX2NSZWY/LmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQ7XG5cdFx0aWYgKHBvcHVwRWwpIHtcblx0XHRcdGlmIChuZXdDbGFzcykge1xuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhwb3B1cEVsLCBuZXdDbGFzcyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAob2xkQ2xhc3MpIHtcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3MocG9wdXBFbCwgb2xkQ2xhc3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2FwcGx5UG9wdXBTdHlsaW5nKG5hdGl2ZUVsZW1lbnQ6IGFueSkge1xuXHRcdHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKG5hdGl2ZUVsZW1lbnQsICdkcm9wZG93bi1tZW51Jyk7XG5cdFx0dGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgJ3Nob3cnKTtcblxuXHRcdGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG5cdFx0XHR0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhuYXRpdmVFbGVtZW50LCAnbmdiLWRwLWJvZHknKTtcblx0XHR9XG5cblx0XHR0aGlzLl9hcHBseVBvcHVwQ2xhc3ModGhpcy5kYXRlcGlja2VyQ2xhc3MpO1xuXHR9XG5cblx0cHJpdmF0ZSBfc3Vic2NyaWJlRm9yRGF0ZXBpY2tlck91dHB1dHMoZGF0ZXBpY2tlckluc3RhbmNlOiBOZ2JEYXRlcGlja2VyKSB7XG5cdFx0ZGF0ZXBpY2tlckluc3RhbmNlLm5hdmlnYXRlLnN1YnNjcmliZSgobmF2aWdhdGVFdmVudCkgPT4gdGhpcy5uYXZpZ2F0ZS5lbWl0KG5hdmlnYXRlRXZlbnQpKTtcblx0XHRkYXRlcGlja2VySW5zdGFuY2UuZGF0ZVNlbGVjdC5zdWJzY3JpYmUoKGRhdGUpID0+IHtcblx0XHRcdHRoaXMuZGF0ZVNlbGVjdC5lbWl0KGRhdGUpO1xuXHRcdFx0aWYgKHRoaXMuYXV0b0Nsb3NlID09PSB0cnVlIHx8IHRoaXMuYXV0b0Nsb3NlID09PSAnaW5zaWRlJykge1xuXHRcdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF93cml0ZU1vZGVsVmFsdWUobW9kZWw6IE5nYkRhdGUgfCBudWxsKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLl9wYXJzZXJGb3JtYXR0ZXIuZm9ybWF0KG1vZGVsKTtcblx0XHR0aGlzLl9pbnB1dFZhbHVlID0gdmFsdWU7XG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuXHRcdGlmICh0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHR0aGlzLl9jUmVmIS5pbnN0YW5jZS53cml0ZVZhbHVlKHRoaXMuX2RhdGVBZGFwdGVyLnRvTW9kZWwobW9kZWwpKTtcblx0XHRcdHRoaXMuX29uVG91Y2hlZCgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2Zyb21EYXRlU3RydWN0KGRhdGU6IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogTmdiRGF0ZSB8IG51bGwge1xuXHRcdGNvbnN0IG5nYkRhdGUgPSBkYXRlID8gbmV3IE5nYkRhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoLCBkYXRlLmRheSkgOiBudWxsO1xuXHRcdHJldHVybiB0aGlzLl9jYWxlbmRhci5pc1ZhbGlkKG5nYkRhdGUpID8gbmdiRGF0ZSA6IG51bGw7XG5cdH1cblxuXHRwcml2YXRlIF9zZXRDbG9zZUhhbmRsZXJzKCkge1xuXHRcdHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJC5uZXh0KCk7XG5cdFx0bmdiQXV0b0Nsb3NlKFxuXHRcdFx0dGhpcy5fbmdab25lLFxuXHRcdFx0dGhpcy5fZG9jdW1lbnQsXG5cdFx0XHR0aGlzLmF1dG9DbG9zZSxcblx0XHRcdCgpID0+IHRoaXMuY2xvc2UoKSxcblx0XHRcdHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJCxcblx0XHRcdFtdLFxuXHRcdFx0W3RoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX2NSZWYhLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnRdLFxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==