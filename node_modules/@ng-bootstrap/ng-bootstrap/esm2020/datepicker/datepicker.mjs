import { fromEvent, merge, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ContentChild, Directive, EventEmitter, forwardRef, Inject, Input, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbDate } from './ngb-date';
import { NgbDatepickerService } from './datepicker-service';
import { NavigationEvent } from './datepicker-view-model';
import { isChangedDate, isChangedMonth } from './datepicker-tools';
import { hasClassName } from '../util/util';
import { NgbDatepickerDayView } from './datepicker-day-view';
import { NgbDatepickerNavigation } from './datepicker-navigation';
import * as i0 from "@angular/core";
import * as i1 from "./datepicker-i18n";
import * as i2 from "./datepicker-keyboard-service";
import * as i3 from "./datepicker-service";
import * as i4 from "./ngb-calendar";
import * as i5 from "./datepicker-config";
import * as i6 from "./adapters/ngb-date-adapter";
/**
 * A directive that marks the content template that customizes the way datepicker months are displayed
 *
 * @since 5.3.0
 */
export class NgbDatepickerContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbDatepickerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerContent, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDatepickerContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbDatepickerContent, isStandalone: true, selector: "ng-template[ngbDatepickerContent]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerContent, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbDatepickerContent]', standalone: true }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A component that renders one month including all the days, weekdays and week numbers. Can be used inside
 * the `<ng-template ngbDatepickerMonths></ng-template>` when you want to customize months layout.
 *
 * For a usage example, see [custom month layout demo](#/components/datepicker/examples#custommonth)
 *
 * @since 5.3.0
 */
export class NgbDatepickerMonth {
    constructor(i18n, datepicker, _keyboardService, _service) {
        this.i18n = i18n;
        this.datepicker = datepicker;
        this._keyboardService = _keyboardService;
        this._service = _service;
    }
    /**
     * The first date of month to be rendered.
     *
     * This month must one of the months present in the
     * [datepicker state](#/components/datepicker/api#NgbDatepickerState).
     */
    set month(month) {
        this.viewModel = this._service.getMonth(month);
    }
    onKeyDown(event) {
        this._keyboardService.processKey(event, this.datepicker);
    }
    doSelect(day) {
        if (!day.context.disabled && !day.hidden) {
            this.datepicker.onDateSelect(day.date);
        }
    }
}
NgbDatepickerMonth.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerMonth, deps: [{ token: i1.NgbDatepickerI18n }, { token: forwardRef(() => NgbDatepicker) }, { token: i2.NgbDatepickerKeyboardService }, { token: i3.NgbDatepickerService }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepickerMonth.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbDatepickerMonth, isStandalone: true, selector: "ngb-datepicker-month", inputs: { month: "month" }, host: { attributes: { "role": "grid" }, listeners: { "keydown": "onKeyDown($event)" } }, ngImport: i0, template: `
		<div *ngIf="viewModel.weekdays.length > 0" class="ngb-dp-week ngb-dp-weekdays" role="row">
			<div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek small">{{
				i18n.getWeekLabel()
			}}</div>
			<div *ngFor="let weekday of viewModel.weekdays" class="ngb-dp-weekday small" role="columnheader">{{
				weekday
			}}</div>
		</div>
		<ng-template ngFor let-week [ngForOf]="viewModel.weeks">
			<div *ngIf="!week.collapsed" class="ngb-dp-week" role="row">
				<div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-week-number small text-muted">{{
					i18n.getWeekNumerals(week.number)
				}}</div>
				<div
					*ngFor="let day of week.days"
					(click)="doSelect(day); $event.preventDefault()"
					class="ngb-dp-day"
					role="gridcell"
					[class.disabled]="day.context.disabled"
					[tabindex]="day.tabindex"
					[class.hidden]="day.hidden"
					[class.ngb-dp-today]="day.context.today"
					[attr.aria-label]="day.ariaLabel"
				>
					<ng-template [ngIf]="!day.hidden">
						<ng-template
							[ngTemplateOutlet]="datepicker.dayTemplate"
							[ngTemplateOutletContext]="day.context"
						></ng-template>
					</ng-template>
				</div>
			</div>
		</ng-template>
	`, isInline: true, styles: ["ngb-datepicker-month{display:block}.ngb-dp-weekday,.ngb-dp-week-number{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:var(--bs-info)}.ngb-dp-week{border-radius:.25rem;display:flex}.ngb-dp-weekdays{border-bottom:1px solid var(--bs-border-color);border-radius:0;background-color:var(--bs-light)}.ngb-dp-day,.ngb-dp-weekday,.ngb-dp-week-number{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default;pointer-events:none}.ngb-dp-day[tabindex=\"0\"]{z-index:1}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerMonth, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-datepicker-month', standalone: true, imports: [NgIf, NgFor, NgTemplateOutlet], host: { role: 'grid', '(keydown)': 'onKeyDown($event)' }, encapsulation: ViewEncapsulation.None, template: `
		<div *ngIf="viewModel.weekdays.length > 0" class="ngb-dp-week ngb-dp-weekdays" role="row">
			<div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek small">{{
				i18n.getWeekLabel()
			}}</div>
			<div *ngFor="let weekday of viewModel.weekdays" class="ngb-dp-weekday small" role="columnheader">{{
				weekday
			}}</div>
		</div>
		<ng-template ngFor let-week [ngForOf]="viewModel.weeks">
			<div *ngIf="!week.collapsed" class="ngb-dp-week" role="row">
				<div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-week-number small text-muted">{{
					i18n.getWeekNumerals(week.number)
				}}</div>
				<div
					*ngFor="let day of week.days"
					(click)="doSelect(day); $event.preventDefault()"
					class="ngb-dp-day"
					role="gridcell"
					[class.disabled]="day.context.disabled"
					[tabindex]="day.tabindex"
					[class.hidden]="day.hidden"
					[class.ngb-dp-today]="day.context.today"
					[attr.aria-label]="day.ariaLabel"
				>
					<ng-template [ngIf]="!day.hidden">
						<ng-template
							[ngTemplateOutlet]="datepicker.dayTemplate"
							[ngTemplateOutletContext]="day.context"
						></ng-template>
					</ng-template>
				</div>
			</div>
		</ng-template>
	`, styles: ["ngb-datepicker-month{display:block}.ngb-dp-weekday,.ngb-dp-week-number{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:var(--bs-info)}.ngb-dp-week{border-radius:.25rem;display:flex}.ngb-dp-weekdays{border-bottom:1px solid var(--bs-border-color);border-radius:0;background-color:var(--bs-light)}.ngb-dp-day,.ngb-dp-weekday,.ngb-dp-week-number{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default;pointer-events:none}.ngb-dp-day[tabindex=\"0\"]{z-index:1}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgbDatepickerI18n }, { type: NgbDatepicker, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbDatepicker)]
                }] }, { type: i2.NgbDatepickerKeyboardService }, { type: i3.NgbDatepickerService }]; }, propDecorators: { month: [{
                type: Input
            }] } });
/**
 * A highly configurable component that helps you with selecting calendar dates.
 *
 * `NgbDatepicker` is meant to be displayed inline on a page or put inside a popup.
 */
export class NgbDatepicker {
    constructor(_service, _calendar, i18n, config, cd, _elementRef, _ngbDateAdapter, _ngZone) {
        this._service = _service;
        this._calendar = _calendar;
        this.i18n = i18n;
        this._elementRef = _elementRef;
        this._ngbDateAdapter = _ngbDateAdapter;
        this._ngZone = _ngZone;
        this._controlValue = null;
        this._destroyed$ = new Subject();
        this._publicState = {};
        /**
         * An event emitted right before the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * @since 5.2.0
         */
        this.dateSelect = new EventEmitter();
        this.onChange = (_) => { };
        this.onTouched = () => { };
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
            'showWeekNumbers',
            'startDate',
            'weekdays',
        ].forEach((input) => (this[input] = config[input]));
        _service.dateSelect$.pipe(takeUntil(this._destroyed$)).subscribe((date) => {
            this.dateSelect.emit(date);
        });
        _service.model$.pipe(takeUntil(this._destroyed$)).subscribe((model) => {
            const newDate = model.firstDate;
            const oldDate = this.model ? this.model.firstDate : null;
            // update public state
            this._publicState = {
                maxDate: model.maxDate,
                minDate: model.minDate,
                firstDate: model.firstDate,
                lastDate: model.lastDate,
                focusedDate: model.focusDate,
                months: model.months.map((viewModel) => viewModel.firstDate),
            };
            let navigationPrevented = false;
            // emitting navigation event if the first month changes
            if (!newDate.equals(oldDate)) {
                this.navigate.emit({
                    current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
                    next: { year: newDate.year, month: newDate.month },
                    preventDefault: () => (navigationPrevented = true),
                });
                // can't prevent the very first navigation
                if (navigationPrevented && oldDate !== null) {
                    this._service.open(oldDate);
                    return;
                }
            }
            const newSelectedDate = model.selectedDate;
            const newFocusedDate = model.focusDate;
            const oldFocusedDate = this.model ? this.model.focusDate : null;
            this.model = model;
            // handling selection change
            if (isChangedDate(newSelectedDate, this._controlValue)) {
                this._controlValue = newSelectedDate;
                this.onTouched();
                this.onChange(this._ngbDateAdapter.toModel(newSelectedDate));
            }
            // handling focus change
            if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
                this.focus();
            }
            cd.markForCheck();
        });
    }
    /**
     *  Returns the readonly public state of the datepicker
     *
     * @since 5.2.0
     */
    get state() {
        return this._publicState;
    }
    /**
     *  Returns the calendar service used in the specific datepicker instance.
     *
     *  @since 5.3.0
     */
    get calendar() {
        return this._calendar;
    }
    /**
     *  Focuses on given date.
     */
    focusDate(date) {
        this._service.focus(NgbDate.from(date));
    }
    /**
     *  Selects focused date.
     */
    focusSelect() {
        this._service.focusSelect();
    }
    focus() {
        this._ngZone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
            const elementToFocus = this._elementRef.nativeElement.querySelector('div.ngb-dp-day[tabindex="0"]');
            if (elementToFocus) {
                elementToFocus.focus();
            }
        });
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
        this._service.open(NgbDate.from(date ? (date.day ? date : { ...date, day: 1 }) : null));
    }
    ngAfterViewInit() {
        this._ngZone.runOutsideAngular(() => {
            const focusIns$ = fromEvent(this._contentEl.nativeElement, 'focusin');
            const focusOuts$ = fromEvent(this._contentEl.nativeElement, 'focusout');
            const { nativeElement } = this._elementRef;
            // we're changing 'focusVisible' only when entering or leaving months view
            // and ignoring all focus events where both 'target' and 'related' target are day cells
            merge(focusIns$, focusOuts$)
                .pipe(filter(({ target, relatedTarget }) => !(hasClassName(target, 'ngb-dp-day') &&
                hasClassName(relatedTarget, 'ngb-dp-day') &&
                nativeElement.contains(target) &&
                nativeElement.contains(relatedTarget))), takeUntil(this._destroyed$))
                .subscribe(({ type }) => this._ngZone.run(() => this._service.set({ focusVisible: type === 'focusin' })));
        });
    }
    ngOnDestroy() {
        this._destroyed$.next();
    }
    ngOnInit() {
        if (this.model === undefined) {
            const inputs = {};
            [
                'dayTemplateData',
                'displayMonths',
                'markDisabled',
                'firstDayOfWeek',
                'navigation',
                'minDate',
                'maxDate',
                'outsideDays',
                'weekdays',
            ].forEach((name) => (inputs[name] = this[name]));
            this._service.set(inputs);
            this.navigateTo(this.startDate);
        }
        if (!this.dayTemplate) {
            this.dayTemplate = this._defaultDayTemplate;
        }
    }
    ngOnChanges(changes) {
        const inputs = {};
        [
            'dayTemplateData',
            'displayMonths',
            'markDisabled',
            'firstDayOfWeek',
            'navigation',
            'minDate',
            'maxDate',
            'outsideDays',
            'weekdays',
        ]
            .filter((name) => name in changes)
            .forEach((name) => (inputs[name] = this[name]));
        this._service.set(inputs);
        if ('startDate' in changes) {
            const { currentValue, previousValue } = changes.startDate;
            if (isChangedMonth(previousValue, currentValue)) {
                this.navigateTo(this.startDate);
            }
        }
    }
    onDateSelect(date) {
        this._service.focus(date);
        this._service.select(date, { emitEvent: true });
    }
    onNavigateDateSelect(date) {
        this._service.open(date);
    }
    onNavigateEvent(event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._service.open(this._calendar.getPrev(this.model.firstDate, 'm', 1));
                break;
            case NavigationEvent.NEXT:
                this._service.open(this._calendar.getNext(this.model.firstDate, 'm', 1));
                break;
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(disabled) {
        this._service.set({ disabled });
    }
    writeValue(value) {
        this._controlValue = NgbDate.from(this._ngbDateAdapter.fromModel(value));
        this._service.select(this._controlValue);
    }
}
NgbDatepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepicker, deps: [{ token: i3.NgbDatepickerService }, { token: i4.NgbCalendar }, { token: i1.NgbDatepickerI18n }, { token: i5.NgbDatepickerConfig }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i6.NgbDateAdapter }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbDatepicker, isStandalone: true, selector: "ngb-datepicker", inputs: { dayTemplate: "dayTemplate", dayTemplateData: "dayTemplateData", displayMonths: "displayMonths", firstDayOfWeek: "firstDayOfWeek", footerTemplate: "footerTemplate", markDisabled: "markDisabled", maxDate: "maxDate", minDate: "minDate", navigation: "navigation", outsideDays: "outsideDays", showWeekNumbers: "showWeekNumbers", startDate: "startDate", weekdays: "weekdays" }, outputs: { navigate: "navigate", dateSelect: "dateSelect" }, host: { properties: { "class.disabled": "model.disabled" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true },
        NgbDatepickerService,
    ], queries: [{ propertyName: "contentTemplate", first: true, predicate: NgbDatepickerContent, descendants: true, static: true }], viewQueries: [{ propertyName: "_defaultDayTemplate", first: true, predicate: ["defaultDayTemplate"], descendants: true, static: true }, { propertyName: "_contentEl", first: true, predicate: ["content"], descendants: true, static: true }], exportAs: ["ngbDatepicker"], usesOnChanges: true, ngImport: i0, template: `
		<ng-template
			#defaultDayTemplate
			let-date="date"
			let-currentMonth="currentMonth"
			let-selected="selected"
			let-disabled="disabled"
			let-focused="focused"
		>
			<div
				ngbDatepickerDayView
				[date]="date"
				[currentMonth]="currentMonth"
				[selected]="selected"
				[disabled]="disabled"
				[focused]="focused"
			>
			</div>
		</ng-template>

		<ng-template #defaultContentTemplate>
			<div *ngFor="let month of model.months; let i = index" class="ngb-dp-month">
				<div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')" class="ngb-dp-month-name">
					{{ i18n.getMonthLabel(month.firstDate) }}
				</div>
				<ngb-datepicker-month [month]="month.firstDate"></ngb-datepicker-month>
			</div>
		</ng-template>

		<div class="ngb-dp-header">
			<ngb-datepicker-navigation
				*ngIf="navigation !== 'none'"
				[date]="model.firstDate!"
				[months]="model.months"
				[disabled]="model.disabled"
				[showSelect]="model.navigation === 'select'"
				[prevDisabled]="model.prevDisabled"
				[nextDisabled]="model.nextDisabled"
				[selectBoxes]="model.selectBoxes"
				(navigate)="onNavigateEvent($event)"
				(select)="onNavigateDateSelect($event)"
			>
			</ngb-datepicker-navigation>
		</div>

		<div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
			<ng-template [ngTemplateOutlet]="contentTemplate?.templateRef || defaultContentTemplate"></ng-template>
		</div>

		<ng-template [ngTemplateOutlet]="footerTemplate"></ng-template>
	`, isInline: true, styles: ["ngb-datepicker{border:1px solid var(--bs-border-color);border-radius:.25rem;display:inline-block}ngb-datepicker-month{pointer-events:auto}ngb-datepicker.dropdown-menu{padding:0}ngb-datepicker.disabled .ngb-dp-weekday,ngb-datepicker.disabled .ngb-dp-week-number,ngb-datepicker.disabled .ngb-dp-month-name{color:var(--bs-text-muted)}.ngb-dp-body{z-index:1055}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem;background-color:var(--bs-light)}.ngb-dp-months{display:flex}.ngb-dp-month{pointer-events:none}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center;background-color:var(--bs-light)}.ngb-dp-month+.ngb-dp-month .ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month .ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month .ngb-dp-week:last-child{padding-bottom:.25rem}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: NgbDatepickerDayView, selector: "[ngbDatepickerDayView]", inputs: ["currentMonth", "date", "disabled", "focused", "selected"] }, { kind: "component", type: NgbDatepickerMonth, selector: "ngb-datepicker-month", inputs: ["month"] }, { kind: "component", type: NgbDatepickerNavigation, selector: "ngb-datepicker-navigation", inputs: ["date", "disabled", "months", "showSelect", "prevDisabled", "nextDisabled", "selectBoxes"], outputs: ["navigate", "select"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepicker, decorators: [{
            type: Component,
            args: [{ exportAs: 'ngbDatepicker', selector: 'ngb-datepicker', standalone: true, imports: [NgIf, NgFor, NgTemplateOutlet, NgbDatepickerDayView, NgbDatepickerMonth, NgbDatepickerNavigation], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: { '[class.disabled]': 'model.disabled' }, template: `
		<ng-template
			#defaultDayTemplate
			let-date="date"
			let-currentMonth="currentMonth"
			let-selected="selected"
			let-disabled="disabled"
			let-focused="focused"
		>
			<div
				ngbDatepickerDayView
				[date]="date"
				[currentMonth]="currentMonth"
				[selected]="selected"
				[disabled]="disabled"
				[focused]="focused"
			>
			</div>
		</ng-template>

		<ng-template #defaultContentTemplate>
			<div *ngFor="let month of model.months; let i = index" class="ngb-dp-month">
				<div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')" class="ngb-dp-month-name">
					{{ i18n.getMonthLabel(month.firstDate) }}
				</div>
				<ngb-datepicker-month [month]="month.firstDate"></ngb-datepicker-month>
			</div>
		</ng-template>

		<div class="ngb-dp-header">
			<ngb-datepicker-navigation
				*ngIf="navigation !== 'none'"
				[date]="model.firstDate!"
				[months]="model.months"
				[disabled]="model.disabled"
				[showSelect]="model.navigation === 'select'"
				[prevDisabled]="model.prevDisabled"
				[nextDisabled]="model.nextDisabled"
				[selectBoxes]="model.selectBoxes"
				(navigate)="onNavigateEvent($event)"
				(select)="onNavigateDateSelect($event)"
			>
			</ngb-datepicker-navigation>
		</div>

		<div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
			<ng-template [ngTemplateOutlet]="contentTemplate?.templateRef || defaultContentTemplate"></ng-template>
		</div>

		<ng-template [ngTemplateOutlet]="footerTemplate"></ng-template>
	`, providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true },
                        NgbDatepickerService,
                    ], styles: ["ngb-datepicker{border:1px solid var(--bs-border-color);border-radius:.25rem;display:inline-block}ngb-datepicker-month{pointer-events:auto}ngb-datepicker.dropdown-menu{padding:0}ngb-datepicker.disabled .ngb-dp-weekday,ngb-datepicker.disabled .ngb-dp-week-number,ngb-datepicker.disabled .ngb-dp-month-name{color:var(--bs-text-muted)}.ngb-dp-body{z-index:1055}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem;background-color:var(--bs-light)}.ngb-dp-months{display:flex}.ngb-dp-month{pointer-events:none}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center;background-color:var(--bs-light)}.ngb-dp-month+.ngb-dp-month .ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month .ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month .ngb-dp-week:last-child{padding-bottom:.25rem}\n"] }]
        }], ctorParameters: function () { return [{ type: i3.NgbDatepickerService }, { type: i4.NgbCalendar }, { type: i1.NgbDatepickerI18n }, { type: i5.NgbDatepickerConfig }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i6.NgbDateAdapter }, { type: i0.NgZone }]; }, propDecorators: { _defaultDayTemplate: [{
                type: ViewChild,
                args: ['defaultDayTemplate', { static: true }]
            }], _contentEl: [{
                type: ViewChild,
                args: ['content', { static: true }]
            }], contentTemplate: [{
                type: ContentChild,
                args: [NgbDatepickerContent, { static: true }]
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
            }], maxDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], navigation: [{
                type: Input
            }], outsideDays: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], startDate: [{
                type: Input
            }], weekdays: [{
                type: Input
            }], navigate: [{
                type: Output
            }], dateSelect: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2RhdGVwaWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFFTix1QkFBdUIsRUFFdkIsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBRVQsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUtMLE1BQU0sRUFHTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBb0IsTUFBTSxpQkFBaUIsQ0FBQztBQUdsRixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBMkIsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRixPQUFPLEVBQXFELGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBTzdHLE9BQU8sRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7Ozs7Ozs7QUFpRWxFOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sb0JBQW9CO0lBQ2hDLFlBQW1CLFdBQTZCO1FBQTdCLGdCQUFX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LEtBQUs7Z0JBVUcsU0FBUztzQkFBakIsS0FBSztnQkFXRyxRQUFRO3NCQUFoQixLQUFLO2dCQU9JLFFBQVE7c0JBQWpCLE1BQU07Z0JBU0csVUFBVTtzQkFBbkIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZyb21FdmVudCwgbWVyZ2UsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcblx0QWZ0ZXJWaWV3SW5pdCxcblx0Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnQsXG5cdENvbnRlbnRDaGlsZCxcblx0RGlyZWN0aXZlLFxuXHRFbGVtZW50UmVmLFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEluamVjdCxcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0NoaWxkLFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOZ0ZvciwgTmdJZiwgTmdUZW1wbGF0ZU91dGxldCwgVHJhbnNsYXRpb25XaWR0aCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IE5nYkNhbGVuZGFyIH0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuaW1wb3J0IHsgTmdiRGF0ZSB9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHMsIE5nYkRhdGVwaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9kYXRlcGlja2VyLXNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlclZpZXdNb2RlbCwgRGF5Vmlld01vZGVsLCBNb250aFZpZXdNb2RlbCwgTmF2aWdhdGlvbkV2ZW50IH0gZnJvbSAnLi9kYXRlcGlja2VyLXZpZXctbW9kZWwnO1xuaW1wb3J0IHsgRGF5VGVtcGxhdGVDb250ZXh0IH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcbmltcG9ydCB7IE5nYkRhdGVwaWNrZXJDb25maWcgfSBmcm9tICcuL2RhdGVwaWNrZXItY29uZmlnJztcbmltcG9ydCB7IE5nYkRhdGVBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IE5nYkRhdGVTdHJ1Y3QgfSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQgeyBOZ2JEYXRlcGlja2VySTE4biB9IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcbmltcG9ydCB7IE5nYkRhdGVwaWNrZXJLZXlib2FyZFNlcnZpY2UgfSBmcm9tICcuL2RhdGVwaWNrZXIta2V5Ym9hcmQtc2VydmljZSc7XG5pbXBvcnQgeyBpc0NoYW5nZWREYXRlLCBpc0NoYW5nZWRNb250aCB9IGZyb20gJy4vZGF0ZXBpY2tlci10b29scyc7XG5pbXBvcnQgeyBoYXNDbGFzc05hbWUgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgTmdiRGF0ZXBpY2tlckRheVZpZXcgfSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXZpZXcnO1xuaW1wb3J0IHsgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb24gfSBmcm9tICcuL2RhdGVwaWNrZXItbmF2aWdhdGlvbic7XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdGhlIG5hdmlnYXRpb24gaGFwcGVucyBhbmQgdGhlIG1vbnRoIGRpc3BsYXllZCBieSB0aGUgZGF0ZXBpY2tlciBjaGFuZ2VzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50IHtcblx0LyoqXG5cdCAqIFRoZSBjdXJyZW50bHkgZGlzcGxheWVkIG1vbnRoLlxuXHQgKi9cblx0Y3VycmVudDogeyB5ZWFyOiBudW1iZXI7IG1vbnRoOiBudW1iZXIgfSB8IG51bGw7XG5cblx0LyoqXG5cdCAqIFRoZSBtb250aCB3ZSdyZSBuYXZpZ2F0aW5nIHRvLlxuXHQgKi9cblx0bmV4dDogeyB5ZWFyOiBudW1iZXI7IG1vbnRoOiBudW1iZXIgfTtcblxuXHQvKipcblx0ICogQ2FsbGluZyB0aGlzIGZ1bmN0aW9uIHdpbGwgcHJldmVudCBuYXZpZ2F0aW9uIGZyb20gaGFwcGVuaW5nLlxuXHQgKlxuXHQgKiBAc2luY2UgNC4xLjBcblx0ICovXG5cdHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIEFuIGludGVyZmFjZSB0aGF0IHJlcHJlc2VudHMgdGhlIHJlYWRvbmx5IHB1YmxpYyBzdGF0ZSBvZiB0aGUgZGF0ZXBpY2tlci5cbiAqXG4gKiBBY2Nlc3NpYmxlIHZpYSB0aGUgYGRhdGVwaWNrZXIuc3RhdGVgIGdldHRlclxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYkRhdGVwaWNrZXJTdGF0ZSB7XG5cdC8qKlxuXHQgKiBUaGUgZWFybGllc3QgZGF0ZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb3Igc2VsZWN0ZWRcblx0ICovXG5cdHJlYWRvbmx5IG1pbkRhdGU6IE5nYkRhdGUgfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBUaGUgbGF0ZXN0IGRhdGUgdGhhdCBjYW4gYmUgZGlzcGxheWVkIG9yIHNlbGVjdGVkXG5cdCAqL1xuXHRyZWFkb25seSBtYXhEYXRlOiBOZ2JEYXRlIHwgbnVsbDtcblxuXHQvKipcblx0ICogVGhlIGZpcnN0IHZpc2libGUgZGF0ZSBvZiBjdXJyZW50bHkgZGlzcGxheWVkIG1vbnRoc1xuXHQgKi9cblx0cmVhZG9ubHkgZmlyc3REYXRlOiBOZ2JEYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUgbGFzdCB2aXNpYmxlIGRhdGUgb2YgY3VycmVudGx5IGRpc3BsYXllZCBtb250aHNcblx0ICovXG5cdHJlYWRvbmx5IGxhc3REYXRlOiBOZ2JEYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUgZGF0ZSBjdXJyZW50bHkgZm9jdXNlZCBieSB0aGUgZGF0ZXBpY2tlclxuXHQgKi9cblx0cmVhZG9ubHkgZm9jdXNlZERhdGU6IE5nYkRhdGU7XG5cblx0LyoqXG5cdCAqIEZpcnN0IGRhdGVzIG9mIG1vbnRocyBjdXJyZW50bHkgZGlzcGxheWVkIGJ5IHRoZSBkYXRlcGlja2VyXG5cdCAqXG5cdCAqIEBzaW5jZSA1LjMuMFxuXHQgKi9cblx0cmVhZG9ubHkgbW9udGhzOiBOZ2JEYXRlW107XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBtYXJrcyB0aGUgY29udGVudCB0ZW1wbGF0ZSB0aGF0IGN1c3RvbWl6ZXMgdGhlIHdheSBkYXRlcGlja2VyIG1vbnRocyBhcmUgZGlzcGxheWVkXG4gKlxuICogQHNpbmNlIDUuMy4wXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYkRhdGVwaWNrZXJDb250ZW50XScsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyQ29udGVudCB7XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgb25lIG1vbnRoIGluY2x1ZGluZyBhbGwgdGhlIGRheXMsIHdlZWtkYXlzIGFuZCB3ZWVrIG51bWJlcnMuIENhbiBiZSB1c2VkIGluc2lkZVxuICogdGhlIGA8bmctdGVtcGxhdGUgbmdiRGF0ZXBpY2tlck1vbnRocz48L25nLXRlbXBsYXRlPmAgd2hlbiB5b3Ugd2FudCB0byBjdXN0b21pemUgbW9udGhzIGxheW91dC5cbiAqXG4gKiBGb3IgYSB1c2FnZSBleGFtcGxlLCBzZWUgW2N1c3RvbSBtb250aCBsYXlvdXQgZGVtb10oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvZXhhbXBsZXMjY3VzdG9tbW9udGgpXG4gKlxuICogQHNpbmNlIDUuMy4wXG4gKi9cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi1kYXRlcGlja2VyLW1vbnRoJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aW1wb3J0czogW05nSWYsIE5nRm9yLCBOZ1RlbXBsYXRlT3V0bGV0XSxcblx0aG9zdDogeyByb2xlOiAnZ3JpZCcsICcoa2V5ZG93biknOiAnb25LZXlEb3duKCRldmVudCknIH0sXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdHN0eWxlVXJsczogWycuL2RhdGVwaWNrZXItbW9udGguc2NzcyddLFxuXHR0ZW1wbGF0ZTogYFxuXHRcdDxkaXYgKm5nSWY9XCJ2aWV3TW9kZWwud2Vla2RheXMubGVuZ3RoID4gMFwiIGNsYXNzPVwibmdiLWRwLXdlZWsgbmdiLWRwLXdlZWtkYXlzXCIgcm9sZT1cInJvd1wiPlxuXHRcdFx0PGRpdiAqbmdJZj1cImRhdGVwaWNrZXIuc2hvd1dlZWtOdW1iZXJzXCIgY2xhc3M9XCJuZ2ItZHAtd2Vla2RheSBuZ2ItZHAtc2hvd3dlZWsgc21hbGxcIj57e1xuXHRcdFx0XHRpMThuLmdldFdlZWtMYWJlbCgpXG5cdFx0XHR9fTwvZGl2PlxuXHRcdFx0PGRpdiAqbmdGb3I9XCJsZXQgd2Vla2RheSBvZiB2aWV3TW9kZWwud2Vla2RheXNcIiBjbGFzcz1cIm5nYi1kcC13ZWVrZGF5IHNtYWxsXCIgcm9sZT1cImNvbHVtbmhlYWRlclwiPnt7XG5cdFx0XHRcdHdlZWtkYXlcblx0XHRcdH19PC9kaXY+XG5cdFx0PC9kaXY+XG5cdFx0PG5nLXRlbXBsYXRlIG5nRm9yIGxldC13ZWVrIFtuZ0Zvck9mXT1cInZpZXdNb2RlbC53ZWVrc1wiPlxuXHRcdFx0PGRpdiAqbmdJZj1cIiF3ZWVrLmNvbGxhcHNlZFwiIGNsYXNzPVwibmdiLWRwLXdlZWtcIiByb2xlPVwicm93XCI+XG5cdFx0XHRcdDxkaXYgKm5nSWY9XCJkYXRlcGlja2VyLnNob3dXZWVrTnVtYmVyc1wiIGNsYXNzPVwibmdiLWRwLXdlZWstbnVtYmVyIHNtYWxsIHRleHQtbXV0ZWRcIj57e1xuXHRcdFx0XHRcdGkxOG4uZ2V0V2Vla051bWVyYWxzKHdlZWsubnVtYmVyKVxuXHRcdFx0XHR9fTwvZGl2PlxuXHRcdFx0XHQ8ZGl2XG5cdFx0XHRcdFx0Km5nRm9yPVwibGV0IGRheSBvZiB3ZWVrLmRheXNcIlxuXHRcdFx0XHRcdChjbGljayk9XCJkb1NlbGVjdChkYXkpOyAkZXZlbnQucHJldmVudERlZmF1bHQoKVwiXG5cdFx0XHRcdFx0Y2xhc3M9XCJuZ2ItZHAtZGF5XCJcblx0XHRcdFx0XHRyb2xlPVwiZ3JpZGNlbGxcIlxuXHRcdFx0XHRcdFtjbGFzcy5kaXNhYmxlZF09XCJkYXkuY29udGV4dC5kaXNhYmxlZFwiXG5cdFx0XHRcdFx0W3RhYmluZGV4XT1cImRheS50YWJpbmRleFwiXG5cdFx0XHRcdFx0W2NsYXNzLmhpZGRlbl09XCJkYXkuaGlkZGVuXCJcblx0XHRcdFx0XHRbY2xhc3MubmdiLWRwLXRvZGF5XT1cImRheS5jb250ZXh0LnRvZGF5XCJcblx0XHRcdFx0XHRbYXR0ci5hcmlhLWxhYmVsXT1cImRheS5hcmlhTGFiZWxcIlxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PG5nLXRlbXBsYXRlIFtuZ0lmXT1cIiFkYXkuaGlkZGVuXCI+XG5cdFx0XHRcdFx0XHQ8bmctdGVtcGxhdGVcblx0XHRcdFx0XHRcdFx0W25nVGVtcGxhdGVPdXRsZXRdPVwiZGF0ZXBpY2tlci5kYXlUZW1wbGF0ZVwiXG5cdFx0XHRcdFx0XHRcdFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJkYXkuY29udGV4dFwiXG5cdFx0XHRcdFx0XHQ+PC9uZy10ZW1wbGF0ZT5cblx0XHRcdFx0XHQ8L25nLXRlbXBsYXRlPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvbmctdGVtcGxhdGU+XG5cdGAsXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJNb250aCB7XG5cdC8qKlxuXHQgKiBUaGUgZmlyc3QgZGF0ZSBvZiBtb250aCB0byBiZSByZW5kZXJlZC5cblx0ICpcblx0ICogVGhpcyBtb250aCBtdXN0IG9uZSBvZiB0aGUgbW9udGhzIHByZXNlbnQgaW4gdGhlXG5cdCAqIFtkYXRlcGlja2VyIHN0YXRlXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjTmdiRGF0ZXBpY2tlclN0YXRlKS5cblx0ICovXG5cdEBJbnB1dCgpXG5cdHNldCBtb250aChtb250aDogTmdiRGF0ZVN0cnVjdCkge1xuXHRcdHRoaXMudmlld01vZGVsID0gdGhpcy5fc2VydmljZS5nZXRNb250aChtb250aCk7XG5cdH1cblxuXHR2aWV3TW9kZWw6IE1vbnRoVmlld01vZGVsO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHB1YmxpYyBpMThuOiBOZ2JEYXRlcGlja2VySTE4bixcblx0XHRASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiRGF0ZXBpY2tlcikpIHB1YmxpYyBkYXRlcGlja2VyOiBOZ2JEYXRlcGlja2VyLFxuXHRcdHByaXZhdGUgX2tleWJvYXJkU2VydmljZTogTmdiRGF0ZXBpY2tlcktleWJvYXJkU2VydmljZSxcblx0XHRwcml2YXRlIF9zZXJ2aWNlOiBOZ2JEYXRlcGlja2VyU2VydmljZSxcblx0KSB7fVxuXG5cdG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuXHRcdHRoaXMuX2tleWJvYXJkU2VydmljZS5wcm9jZXNzS2V5KGV2ZW50LCB0aGlzLmRhdGVwaWNrZXIpO1xuXHR9XG5cblx0ZG9TZWxlY3QoZGF5OiBEYXlWaWV3TW9kZWwpIHtcblx0XHRpZiAoIWRheS5jb250ZXh0LmRpc2FibGVkICYmICFkYXkuaGlkZGVuKSB7XG5cdFx0XHR0aGlzLmRhdGVwaWNrZXIub25EYXRlU2VsZWN0KGRheS5kYXRlKTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBBIGhpZ2hseSBjb25maWd1cmFibGUgY29tcG9uZW50IHRoYXQgaGVscHMgeW91IHdpdGggc2VsZWN0aW5nIGNhbGVuZGFyIGRhdGVzLlxuICpcbiAqIGBOZ2JEYXRlcGlja2VyYCBpcyBtZWFudCB0byBiZSBkaXNwbGF5ZWQgaW5saW5lIG9uIGEgcGFnZSBvciBwdXQgaW5zaWRlIGEgcG9wdXAuXG4gKi9cbkBDb21wb25lbnQoe1xuXHRleHBvcnRBczogJ25nYkRhdGVwaWNrZXInLFxuXHRzZWxlY3RvcjogJ25nYi1kYXRlcGlja2VyJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aW1wb3J0czogW05nSWYsIE5nRm9yLCBOZ1RlbXBsYXRlT3V0bGV0LCBOZ2JEYXRlcGlja2VyRGF5VmlldywgTmdiRGF0ZXBpY2tlck1vbnRoLCBOZ2JEYXRlcGlja2VyTmF2aWdhdGlvbl0sXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRzdHlsZVVybHM6IFsnLi9kYXRlcGlja2VyLnNjc3MnXSxcblx0aG9zdDogeyAnW2NsYXNzLmRpc2FibGVkXSc6ICdtb2RlbC5kaXNhYmxlZCcgfSxcblx0dGVtcGxhdGU6IGBcblx0XHQ8bmctdGVtcGxhdGVcblx0XHRcdCNkZWZhdWx0RGF5VGVtcGxhdGVcblx0XHRcdGxldC1kYXRlPVwiZGF0ZVwiXG5cdFx0XHRsZXQtY3VycmVudE1vbnRoPVwiY3VycmVudE1vbnRoXCJcblx0XHRcdGxldC1zZWxlY3RlZD1cInNlbGVjdGVkXCJcblx0XHRcdGxldC1kaXNhYmxlZD1cImRpc2FibGVkXCJcblx0XHRcdGxldC1mb2N1c2VkPVwiZm9jdXNlZFwiXG5cdFx0PlxuXHRcdFx0PGRpdlxuXHRcdFx0XHRuZ2JEYXRlcGlja2VyRGF5Vmlld1xuXHRcdFx0XHRbZGF0ZV09XCJkYXRlXCJcblx0XHRcdFx0W2N1cnJlbnRNb250aF09XCJjdXJyZW50TW9udGhcIlxuXHRcdFx0XHRbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuXHRcdFx0XHRbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuXHRcdFx0XHRbZm9jdXNlZF09XCJmb2N1c2VkXCJcblx0XHRcdD5cblx0XHRcdDwvZGl2PlxuXHRcdDwvbmctdGVtcGxhdGU+XG5cblx0XHQ8bmctdGVtcGxhdGUgI2RlZmF1bHRDb250ZW50VGVtcGxhdGU+XG5cdFx0XHQ8ZGl2ICpuZ0Zvcj1cImxldCBtb250aCBvZiBtb2RlbC5tb250aHM7IGxldCBpID0gaW5kZXhcIiBjbGFzcz1cIm5nYi1kcC1tb250aFwiPlxuXHRcdFx0XHQ8ZGl2ICpuZ0lmPVwibmF2aWdhdGlvbiA9PT0gJ25vbmUnIHx8IChkaXNwbGF5TW9udGhzID4gMSAmJiBuYXZpZ2F0aW9uID09PSAnc2VsZWN0JylcIiBjbGFzcz1cIm5nYi1kcC1tb250aC1uYW1lXCI+XG5cdFx0XHRcdFx0e3sgaTE4bi5nZXRNb250aExhYmVsKG1vbnRoLmZpcnN0RGF0ZSkgfX1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxuZ2ItZGF0ZXBpY2tlci1tb250aCBbbW9udGhdPVwibW9udGguZmlyc3REYXRlXCI+PC9uZ2ItZGF0ZXBpY2tlci1tb250aD5cblx0XHRcdDwvZGl2PlxuXHRcdDwvbmctdGVtcGxhdGU+XG5cblx0XHQ8ZGl2IGNsYXNzPVwibmdiLWRwLWhlYWRlclwiPlxuXHRcdFx0PG5nYi1kYXRlcGlja2VyLW5hdmlnYXRpb25cblx0XHRcdFx0Km5nSWY9XCJuYXZpZ2F0aW9uICE9PSAnbm9uZSdcIlxuXHRcdFx0XHRbZGF0ZV09XCJtb2RlbC5maXJzdERhdGUhXCJcblx0XHRcdFx0W21vbnRoc109XCJtb2RlbC5tb250aHNcIlxuXHRcdFx0XHRbZGlzYWJsZWRdPVwibW9kZWwuZGlzYWJsZWRcIlxuXHRcdFx0XHRbc2hvd1NlbGVjdF09XCJtb2RlbC5uYXZpZ2F0aW9uID09PSAnc2VsZWN0J1wiXG5cdFx0XHRcdFtwcmV2RGlzYWJsZWRdPVwibW9kZWwucHJldkRpc2FibGVkXCJcblx0XHRcdFx0W25leHREaXNhYmxlZF09XCJtb2RlbC5uZXh0RGlzYWJsZWRcIlxuXHRcdFx0XHRbc2VsZWN0Qm94ZXNdPVwibW9kZWwuc2VsZWN0Qm94ZXNcIlxuXHRcdFx0XHQobmF2aWdhdGUpPVwib25OYXZpZ2F0ZUV2ZW50KCRldmVudClcIlxuXHRcdFx0XHQoc2VsZWN0KT1cIm9uTmF2aWdhdGVEYXRlU2VsZWN0KCRldmVudClcIlxuXHRcdFx0PlxuXHRcdFx0PC9uZ2ItZGF0ZXBpY2tlci1uYXZpZ2F0aW9uPlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBjbGFzcz1cIm5nYi1kcC1jb250ZW50XCIgW2NsYXNzLm5nYi1kcC1tb250aHNdPVwiIWNvbnRlbnRUZW1wbGF0ZVwiICNjb250ZW50PlxuXHRcdFx0PG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRlbnRUZW1wbGF0ZT8udGVtcGxhdGVSZWYgfHwgZGVmYXVsdENvbnRlbnRUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG5cdFx0PC9kaXY+XG5cblx0XHQ8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9vdGVyVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuXHRgLFxuXHRwcm92aWRlcnM6IFtcblx0XHR7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JEYXRlcGlja2VyKSwgbXVsdGk6IHRydWUgfSxcblx0XHROZ2JEYXRlcGlja2VyU2VydmljZSxcblx0XSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9DbG9zZTogYm9vbGVhbiB8IHN0cmluZztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX25hdmlnYXRpb246IHN0cmluZztcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX291dHNpZGVEYXlzOiBzdHJpbmc7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV93ZWVrZGF5czogYm9vbGVhbiB8IG51bWJlcjtcblxuXHRtb2RlbDogRGF0ZXBpY2tlclZpZXdNb2RlbDtcblxuXHRAVmlld0NoaWxkKCdkZWZhdWx0RGF5VGVtcGxhdGUnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIF9kZWZhdWx0RGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPERheVRlbXBsYXRlQ29udGV4dD47XG5cdEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIF9jb250ZW50RWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXHRAQ29udGVudENoaWxkKE5nYkRhdGVwaWNrZXJDb250ZW50LCB7IHN0YXRpYzogdHJ1ZSB9KSBjb250ZW50VGVtcGxhdGU/OiBOZ2JEYXRlcGlja2VyQ29udGVudDtcblxuXHRwcml2YXRlIF9jb250cm9sVmFsdWU6IE5nYkRhdGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfZGVzdHJveWVkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cdHByaXZhdGUgX3B1YmxpY1N0YXRlOiBOZ2JEYXRlcGlja2VyU3RhdGUgPSA8YW55Pnt9O1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVmZXJlbmNlIHRvIGEgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZGF5LlxuXHQgKlxuXHQgKiBBbGxvd3MgdG8gY29tcGxldGVseSBvdmVycmlkZSB0aGUgd2F5IGEgZGF5ICdjZWxsJyBpbiB0aGUgY2FsZW5kYXIgaXMgZGlzcGxheWVkLlxuXHQgKlxuXHQgKiBTZWUgW2BEYXlUZW1wbGF0ZUNvbnRleHRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjRGF5VGVtcGxhdGVDb250ZXh0KSBmb3IgdGhlIGRhdGEgeW91IGdldCBpbnNpZGUuXG5cdCAqL1xuXHRASW5wdXQoKSBkYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8RGF5VGVtcGxhdGVDb250ZXh0PjtcblxuXHQvKipcblx0ICogVGhlIGNhbGxiYWNrIHRvIHBhc3MgYW55IGFyYml0cmFyeSBkYXRhIHRvIHRoZSB0ZW1wbGF0ZSBjZWxsIHZpYSB0aGVcblx0ICogW2BEYXlUZW1wbGF0ZUNvbnRleHRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjRGF5VGVtcGxhdGVDb250ZXh0KSdzIGBkYXRhYCBwYXJhbWV0ZXIuXG5cdCAqXG5cdCAqIGBjdXJyZW50YCBpcyB0aGUgbW9udGggdGhhdCBpcyBjdXJyZW50bHkgZGlzcGxheWVkIGJ5IHRoZSBkYXRlcGlja2VyLlxuXHQgKlxuXHQgKiBAc2luY2UgMy4zLjBcblx0ICovXG5cdEBJbnB1dCgpIGRheVRlbXBsYXRlRGF0YTogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ/OiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlciB9KSA9PiBhbnk7XG5cblx0LyoqXG5cdCAqIFRoZSBudW1iZXIgb2YgbW9udGhzIHRvIGRpc3BsYXkuXG5cdCAqL1xuXHRASW5wdXQoKSBkaXNwbGF5TW9udGhzOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG5cdCAqXG5cdCAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICd3ZWVrZGF5JyBpcyAxPU1vbiAuLi4gNz1TdW4uXG5cdCAqL1xuXHRASW5wdXQoKSBmaXJzdERheU9mV2VlazogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVmZXJlbmNlIHRvIHRoZSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBkYXRlcGlja2VyIGZvb3Rlci5cblx0ICpcblx0ICogQHNpbmNlIDMuMy4wXG5cdCAqL1xuXHRASW5wdXQoKSBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuXHQvKipcblx0ICogVGhlIGNhbGxiYWNrIHRvIG1hcmsgc29tZSBkYXRlcyBhcyBkaXNhYmxlZC5cblx0ICpcblx0ICogSXQgaXMgY2FsbGVkIGZvciBlYWNoIG5ldyBkYXRlIHdoZW4gbmF2aWdhdGluZyB0byBhIGRpZmZlcmVudCBtb250aC5cblx0ICpcblx0ICogYGN1cnJlbnRgIGlzIHRoZSBtb250aCB0aGF0IGlzIGN1cnJlbnRseSBkaXNwbGF5ZWQgYnkgdGhlIGRhdGVwaWNrZXIuXG5cdCAqL1xuXHRASW5wdXQoKSBtYXJrRGlzYWJsZWQ6IChkYXRlOiBOZ2JEYXRlLCBjdXJyZW50PzogeyB5ZWFyOiBudW1iZXI7IG1vbnRoOiBudW1iZXIgfSkgPT4gYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIGxhdGVzdCBkYXRlIHRoYXQgY2FuIGJlIGRpc3BsYXllZCBvciBzZWxlY3RlZC5cblx0ICpcblx0ICogSWYgbm90IHByb3ZpZGVkLCAneWVhcicgc2VsZWN0IGJveCB3aWxsIGRpc3BsYXkgMTAgeWVhcnMgYWZ0ZXIgdGhlIGN1cnJlbnQgbW9udGguXG5cdCAqL1xuXHRASW5wdXQoKSBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG5cdC8qKlxuXHQgKiBUaGUgZWFybGllc3QgZGF0ZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb3Igc2VsZWN0ZWQuXG5cdCAqXG5cdCAqIElmIG5vdCBwcm92aWRlZCwgJ3llYXInIHNlbGVjdCBib3ggd2lsbCBkaXNwbGF5IDEwIHllYXJzIGJlZm9yZSB0aGUgY3VycmVudCBtb250aC5cblx0ICovXG5cdEBJbnB1dCgpIG1pbkRhdGU6IE5nYkRhdGVTdHJ1Y3Q7XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRpb24gdHlwZS5cblx0ICpcblx0ICogKiBgXCJzZWxlY3RcImAgLSBzZWxlY3QgYm94ZXMgZm9yIG1vbnRoIGFuZCBuYXZpZ2F0aW9uIGFycm93c1xuXHQgKiAqIGBcImFycm93c1wiYCAtIG9ubHkgbmF2aWdhdGlvbiBhcnJvd3Ncblx0ICogKiBgXCJub25lXCJgIC0gbm8gbmF2aWdhdGlvbiB2aXNpYmxlIGF0IGFsbFxuXHQgKi9cblx0QElucHV0KCkgbmF2aWdhdGlvbjogJ3NlbGVjdCcgfCAnYXJyb3dzJyB8ICdub25lJztcblxuXHQvKipcblx0ICogVGhlIHdheSBvZiBkaXNwbGF5aW5nIGRheXMgdGhhdCBkb24ndCBiZWxvbmcgdG8gdGhlIGN1cnJlbnQgbW9udGguXG5cdCAqXG5cdCAqICogYFwidmlzaWJsZVwiYCAtIGRheXMgYXJlIHZpc2libGVcblx0ICogKiBgXCJoaWRkZW5cImAgLSBkYXlzIGFyZSBoaWRkZW4sIHdoaXRlIHNwYWNlIHByZXNlcnZlZFxuXHQgKiAqIGBcImNvbGxhcHNlZFwiYCAtIGRheXMgYXJlIGNvbGxhcHNlZCwgc28gdGhlIGRhdGVwaWNrZXIgaGVpZ2h0IG1pZ2h0IGNoYW5nZSBiZXR3ZWVuIG1vbnRoc1xuXHQgKlxuXHQgKiBGb3IgdGhlIDIrIG1vbnRocyB2aWV3LCBkYXlzIGluIGJldHdlZW4gbW9udGhzIGFyZSBuZXZlciBzaG93bi5cblx0ICovXG5cdEBJbnB1dCgpIG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHdlZWsgbnVtYmVycyB3aWxsIGJlIGRpc3BsYXllZC5cblx0ICovXG5cdEBJbnB1dCgpIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIGRhdGUgdG8gb3BlbiBjYWxlbmRhciB3aXRoLlxuXHQgKlxuXHQgKiBXaXRoIHRoZSBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbiAuLi4gMTI9RGVjLlxuXHQgKiBJZiBub3RoaW5nIG9yIGludmFsaWQgZGF0ZSBpcyBwcm92aWRlZCwgY2FsZW5kYXIgd2lsbCBvcGVuIHdpdGggY3VycmVudCBtb250aC5cblx0ICpcblx0ICogWW91IGNvdWxkIHVzZSBgbmF2aWdhdGVUbyhkYXRlKWAgbWV0aG9kIGFzIGFuIGFsdGVybmF0aXZlLlxuXHQgKi9cblx0QElucHV0KCkgc3RhcnREYXRlOiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlcjsgZGF5PzogbnVtYmVyIH07XG5cblx0LyoqXG5cdCAqIFRoZSB3YXkgd2Vla2RheXMgc2hvdWxkIGJlIGRpc3BsYXllZC5cblx0ICpcblx0ICogKiBgdHJ1ZWAgLSB3ZWVrZGF5cyBhcmUgZGlzcGxheWVkIHVzaW5nIGRlZmF1bHQgd2lkdGhcblx0ICogKiBgZmFsc2VgIC0gd2Vla2RheXMgYXJlIG5vdCBkaXNwbGF5ZWRcblx0ICogKiBgVHJhbnNsYXRpb25XaWR0aGAgLSB3ZWVrZGF5cyBhcmUgZGlzcGxheWVkIHVzaW5nIHNwZWNpZmllZCB3aWR0aFxuXHQgKlxuXHQgKiBAc2luY2UgOS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHdlZWtkYXlzOiBUcmFuc2xhdGlvbldpZHRoIHwgYm9vbGVhbjtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdGhlIG5hdmlnYXRpb24gaGFwcGVucyBhbmQgZGlzcGxheWVkIG1vbnRoIGNoYW5nZXMuXG5cdCAqXG5cdCAqIFNlZSBbYE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50YF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI05nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50KSBmb3IgdGhlIHBheWxvYWQgaW5mby5cblx0ICovXG5cdEBPdXRwdXQoKSBuYXZpZ2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQ+KCk7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB1c2VyIHNlbGVjdHMgYSBkYXRlIHVzaW5nIGtleWJvYXJkIG9yIG1vdXNlLlxuXHQgKlxuXHQgKiBUaGUgcGF5bG9hZCBvZiB0aGUgZXZlbnQgaXMgY3VycmVudGx5IHNlbGVjdGVkIGBOZ2JEYXRlYC5cblx0ICpcblx0ICogQHNpbmNlIDUuMi4wXG5cdCAqL1xuXHRAT3V0cHV0KCkgZGF0ZVNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZT4oKTtcblxuXHRvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuXHRvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIF9zZXJ2aWNlOiBOZ2JEYXRlcGlja2VyU2VydmljZSxcblx0XHRwcml2YXRlIF9jYWxlbmRhcjogTmdiQ2FsZW5kYXIsXG5cdFx0cHVibGljIGkxOG46IE5nYkRhdGVwaWNrZXJJMThuLFxuXHRcdGNvbmZpZzogTmdiRGF0ZXBpY2tlckNvbmZpZyxcblx0XHRjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG5cdFx0cHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG5cdFx0cHJpdmF0ZSBfbmdiRGF0ZUFkYXB0ZXI6IE5nYkRhdGVBZGFwdGVyPGFueT4sXG5cdFx0cHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG5cdCkge1xuXHRcdFtcblx0XHRcdCdkYXlUZW1wbGF0ZScsXG5cdFx0XHQnZGF5VGVtcGxhdGVEYXRhJyxcblx0XHRcdCdkaXNwbGF5TW9udGhzJyxcblx0XHRcdCdmaXJzdERheU9mV2VlaycsXG5cdFx0XHQnZm9vdGVyVGVtcGxhdGUnLFxuXHRcdFx0J21hcmtEaXNhYmxlZCcsXG5cdFx0XHQnbWluRGF0ZScsXG5cdFx0XHQnbWF4RGF0ZScsXG5cdFx0XHQnbmF2aWdhdGlvbicsXG5cdFx0XHQnb3V0c2lkZURheXMnLFxuXHRcdFx0J3Nob3dXZWVrTnVtYmVycycsXG5cdFx0XHQnc3RhcnREYXRlJyxcblx0XHRcdCd3ZWVrZGF5cycsXG5cdFx0XS5mb3JFYWNoKChpbnB1dCkgPT4gKHRoaXNbaW5wdXRdID0gY29uZmlnW2lucHV0XSkpO1xuXG5cdFx0X3NlcnZpY2UuZGF0ZVNlbGVjdCQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkJCkpLnN1YnNjcmliZSgoZGF0ZSkgPT4ge1xuXHRcdFx0dGhpcy5kYXRlU2VsZWN0LmVtaXQoZGF0ZSk7XG5cdFx0fSk7XG5cblx0XHRfc2VydmljZS5tb2RlbCQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkJCkpLnN1YnNjcmliZSgobW9kZWwpID0+IHtcblx0XHRcdGNvbnN0IG5ld0RhdGUgPSBtb2RlbC5maXJzdERhdGUhO1xuXHRcdFx0Y29uc3Qgb2xkRGF0ZSA9IHRoaXMubW9kZWwgPyB0aGlzLm1vZGVsLmZpcnN0RGF0ZSA6IG51bGw7XG5cblx0XHRcdC8vIHVwZGF0ZSBwdWJsaWMgc3RhdGVcblx0XHRcdHRoaXMuX3B1YmxpY1N0YXRlID0ge1xuXHRcdFx0XHRtYXhEYXRlOiBtb2RlbC5tYXhEYXRlLFxuXHRcdFx0XHRtaW5EYXRlOiBtb2RlbC5taW5EYXRlLFxuXHRcdFx0XHRmaXJzdERhdGU6IG1vZGVsLmZpcnN0RGF0ZSEsXG5cdFx0XHRcdGxhc3REYXRlOiBtb2RlbC5sYXN0RGF0ZSEsXG5cdFx0XHRcdGZvY3VzZWREYXRlOiBtb2RlbC5mb2N1c0RhdGUhLFxuXHRcdFx0XHRtb250aHM6IG1vZGVsLm1vbnRocy5tYXAoKHZpZXdNb2RlbCkgPT4gdmlld01vZGVsLmZpcnN0RGF0ZSksXG5cdFx0XHR9O1xuXG5cdFx0XHRsZXQgbmF2aWdhdGlvblByZXZlbnRlZCA9IGZhbHNlO1xuXHRcdFx0Ly8gZW1pdHRpbmcgbmF2aWdhdGlvbiBldmVudCBpZiB0aGUgZmlyc3QgbW9udGggY2hhbmdlc1xuXHRcdFx0aWYgKCFuZXdEYXRlLmVxdWFscyhvbGREYXRlKSkge1xuXHRcdFx0XHR0aGlzLm5hdmlnYXRlLmVtaXQoe1xuXHRcdFx0XHRcdGN1cnJlbnQ6IG9sZERhdGUgPyB7IHllYXI6IG9sZERhdGUueWVhciwgbW9udGg6IG9sZERhdGUubW9udGggfSA6IG51bGwsXG5cdFx0XHRcdFx0bmV4dDogeyB5ZWFyOiBuZXdEYXRlLnllYXIsIG1vbnRoOiBuZXdEYXRlLm1vbnRoIH0sXG5cdFx0XHRcdFx0cHJldmVudERlZmF1bHQ6ICgpID0+IChuYXZpZ2F0aW9uUHJldmVudGVkID0gdHJ1ZSksXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIGNhbid0IHByZXZlbnQgdGhlIHZlcnkgZmlyc3QgbmF2aWdhdGlvblxuXHRcdFx0XHRpZiAobmF2aWdhdGlvblByZXZlbnRlZCAmJiBvbGREYXRlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhpcy5fc2VydmljZS5vcGVuKG9sZERhdGUpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdTZWxlY3RlZERhdGUgPSBtb2RlbC5zZWxlY3RlZERhdGU7XG5cdFx0XHRjb25zdCBuZXdGb2N1c2VkRGF0ZSA9IG1vZGVsLmZvY3VzRGF0ZTtcblx0XHRcdGNvbnN0IG9sZEZvY3VzZWREYXRlID0gdGhpcy5tb2RlbCA/IHRoaXMubW9kZWwuZm9jdXNEYXRlIDogbnVsbDtcblxuXHRcdFx0dGhpcy5tb2RlbCA9IG1vZGVsO1xuXG5cdFx0XHQvLyBoYW5kbGluZyBzZWxlY3Rpb24gY2hhbmdlXG5cdFx0XHRpZiAoaXNDaGFuZ2VkRGF0ZShuZXdTZWxlY3RlZERhdGUsIHRoaXMuX2NvbnRyb2xWYWx1ZSkpIHtcblx0XHRcdFx0dGhpcy5fY29udHJvbFZhbHVlID0gbmV3U2VsZWN0ZWREYXRlO1xuXHRcdFx0XHR0aGlzLm9uVG91Y2hlZCgpO1xuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlKHRoaXMuX25nYkRhdGVBZGFwdGVyLnRvTW9kZWwobmV3U2VsZWN0ZWREYXRlKSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGhhbmRsaW5nIGZvY3VzIGNoYW5nZVxuXHRcdFx0aWYgKGlzQ2hhbmdlZERhdGUobmV3Rm9jdXNlZERhdGUsIG9sZEZvY3VzZWREYXRlKSAmJiBvbGRGb2N1c2VkRGF0ZSAmJiBtb2RlbC5mb2N1c1Zpc2libGUpIHtcblx0XHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdFx0fVxuXG5cdFx0XHRjZC5tYXJrRm9yQ2hlY2soKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiAgUmV0dXJucyB0aGUgcmVhZG9ubHkgcHVibGljIHN0YXRlIG9mIHRoZSBkYXRlcGlja2VyXG5cdCAqXG5cdCAqIEBzaW5jZSA1LjIuMFxuXHQgKi9cblx0Z2V0IHN0YXRlKCk6IE5nYkRhdGVwaWNrZXJTdGF0ZSB7XG5cdFx0cmV0dXJuIHRoaXMuX3B1YmxpY1N0YXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqICBSZXR1cm5zIHRoZSBjYWxlbmRhciBzZXJ2aWNlIHVzZWQgaW4gdGhlIHNwZWNpZmljIGRhdGVwaWNrZXIgaW5zdGFuY2UuXG5cdCAqXG5cdCAqICBAc2luY2UgNS4zLjBcblx0ICovXG5cdGdldCBjYWxlbmRhcigpOiBOZ2JDYWxlbmRhciB7XG5cdFx0cmV0dXJuIHRoaXMuX2NhbGVuZGFyO1xuXHR9XG5cblx0LyoqXG5cdCAqICBGb2N1c2VzIG9uIGdpdmVuIGRhdGUuXG5cdCAqL1xuXHRmb2N1c0RhdGUoZGF0ZT86IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogdm9pZCB7XG5cdFx0dGhpcy5fc2VydmljZS5mb2N1cyhOZ2JEYXRlLmZyb20oZGF0ZSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqICBTZWxlY3RzIGZvY3VzZWQgZGF0ZS5cblx0ICovXG5cdGZvY3VzU2VsZWN0KCk6IHZvaWQge1xuXHRcdHRoaXMuX3NlcnZpY2UuZm9jdXNTZWxlY3QoKTtcblx0fVxuXG5cdGZvY3VzKCkge1xuXHRcdHRoaXMuX25nWm9uZS5vblN0YWJsZVxuXHRcdFx0LmFzT2JzZXJ2YWJsZSgpXG5cdFx0XHQucGlwZSh0YWtlKDEpKVxuXHRcdFx0LnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGVsZW1lbnRUb0ZvY3VzID1cblx0XHRcdFx0XHR0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oJ2Rpdi5uZ2ItZHAtZGF5W3RhYmluZGV4PVwiMFwiXScpO1xuXHRcdFx0XHRpZiAoZWxlbWVudFRvRm9jdXMpIHtcblx0XHRcdFx0XHRlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gdGhlIHByb3ZpZGVkIGRhdGUuXG5cdCAqXG5cdCAqIFdpdGggdGhlIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG5cdCAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIHByb3ZpZGVkIGNhbGVuZGFyIHdpbGwgb3BlbiBjdXJyZW50IG1vbnRoLlxuXHQgKlxuXHQgKiBVc2UgdGhlIGBbc3RhcnREYXRlXWAgaW5wdXQgYXMgYW4gYWx0ZXJuYXRpdmUuXG5cdCAqL1xuXHRuYXZpZ2F0ZVRvKGRhdGU/OiB7IHllYXI6IG51bWJlcjsgbW9udGg6IG51bWJlcjsgZGF5PzogbnVtYmVyIH0pIHtcblx0XHR0aGlzLl9zZXJ2aWNlLm9wZW4oTmdiRGF0ZS5mcm9tKGRhdGUgPyAoZGF0ZS5kYXkgPyAoZGF0ZSBhcyBOZ2JEYXRlU3RydWN0KSA6IHsgLi4uZGF0ZSwgZGF5OiAxIH0pIDogbnVsbCkpO1xuXHR9XG5cblx0bmdBZnRlclZpZXdJbml0KCkge1xuXHRcdHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRjb25zdCBmb2N1c0lucyQgPSBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4odGhpcy5fY29udGVudEVsLm5hdGl2ZUVsZW1lbnQsICdmb2N1c2luJyk7XG5cdFx0XHRjb25zdCBmb2N1c091dHMkID0gZnJvbUV2ZW50PEZvY3VzRXZlbnQ+KHRoaXMuX2NvbnRlbnRFbC5uYXRpdmVFbGVtZW50LCAnZm9jdXNvdXQnKTtcblx0XHRcdGNvbnN0IHsgbmF0aXZlRWxlbWVudCB9ID0gdGhpcy5fZWxlbWVudFJlZjtcblxuXHRcdFx0Ly8gd2UncmUgY2hhbmdpbmcgJ2ZvY3VzVmlzaWJsZScgb25seSB3aGVuIGVudGVyaW5nIG9yIGxlYXZpbmcgbW9udGhzIHZpZXdcblx0XHRcdC8vIGFuZCBpZ25vcmluZyBhbGwgZm9jdXMgZXZlbnRzIHdoZXJlIGJvdGggJ3RhcmdldCcgYW5kICdyZWxhdGVkJyB0YXJnZXQgYXJlIGRheSBjZWxsc1xuXHRcdFx0bWVyZ2UoZm9jdXNJbnMkLCBmb2N1c091dHMkKVxuXHRcdFx0XHQucGlwZShcblx0XHRcdFx0XHRmaWx0ZXIoXG5cdFx0XHRcdFx0XHQoeyB0YXJnZXQsIHJlbGF0ZWRUYXJnZXQgfSkgPT5cblx0XHRcdFx0XHRcdFx0IShcblx0XHRcdFx0XHRcdFx0XHRoYXNDbGFzc05hbWUodGFyZ2V0LCAnbmdiLWRwLWRheScpICYmXG5cdFx0XHRcdFx0XHRcdFx0aGFzQ2xhc3NOYW1lKHJlbGF0ZWRUYXJnZXQsICduZ2ItZHAtZGF5JykgJiZcblx0XHRcdFx0XHRcdFx0XHRuYXRpdmVFbGVtZW50LmNvbnRhaW5zKHRhcmdldCBhcyBOb2RlKSAmJlxuXHRcdFx0XHRcdFx0XHRcdG5hdGl2ZUVsZW1lbnQuY29udGFpbnMocmVsYXRlZFRhcmdldCBhcyBOb2RlKVxuXHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0dGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCQpLFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5zdWJzY3JpYmUoKHsgdHlwZSB9KSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuX3NlcnZpY2Uuc2V0KHsgZm9jdXNWaXNpYmxlOiB0eXBlID09PSAnZm9jdXNpbicgfSkpKTtcblx0XHR9KTtcblx0fVxuXG5cdG5nT25EZXN0cm95KCkge1xuXHRcdHRoaXMuX2Rlc3Ryb3llZCQubmV4dCgpO1xuXHR9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0aWYgKHRoaXMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgaW5wdXRzOiBEYXRlcGlja2VyU2VydmljZUlucHV0cyA9IHt9O1xuXHRcdFx0W1xuXHRcdFx0XHQnZGF5VGVtcGxhdGVEYXRhJyxcblx0XHRcdFx0J2Rpc3BsYXlNb250aHMnLFxuXHRcdFx0XHQnbWFya0Rpc2FibGVkJyxcblx0XHRcdFx0J2ZpcnN0RGF5T2ZXZWVrJyxcblx0XHRcdFx0J25hdmlnYXRpb24nLFxuXHRcdFx0XHQnbWluRGF0ZScsXG5cdFx0XHRcdCdtYXhEYXRlJyxcblx0XHRcdFx0J291dHNpZGVEYXlzJyxcblx0XHRcdFx0J3dlZWtkYXlzJyxcblx0XHRcdF0uZm9yRWFjaCgobmFtZSkgPT4gKGlucHV0c1tuYW1lXSA9IHRoaXNbbmFtZV0pKTtcblx0XHRcdHRoaXMuX3NlcnZpY2Uuc2V0KGlucHV0cyk7XG5cblx0XHRcdHRoaXMubmF2aWdhdGVUbyh0aGlzLnN0YXJ0RGF0ZSk7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5kYXlUZW1wbGF0ZSkge1xuXHRcdFx0dGhpcy5kYXlUZW1wbGF0ZSA9IHRoaXMuX2RlZmF1bHREYXlUZW1wbGF0ZTtcblx0XHR9XG5cdH1cblxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG5cdFx0Y29uc3QgaW5wdXRzOiBEYXRlcGlja2VyU2VydmljZUlucHV0cyA9IHt9O1xuXHRcdFtcblx0XHRcdCdkYXlUZW1wbGF0ZURhdGEnLFxuXHRcdFx0J2Rpc3BsYXlNb250aHMnLFxuXHRcdFx0J21hcmtEaXNhYmxlZCcsXG5cdFx0XHQnZmlyc3REYXlPZldlZWsnLFxuXHRcdFx0J25hdmlnYXRpb24nLFxuXHRcdFx0J21pbkRhdGUnLFxuXHRcdFx0J21heERhdGUnLFxuXHRcdFx0J291dHNpZGVEYXlzJyxcblx0XHRcdCd3ZWVrZGF5cycsXG5cdFx0XVxuXHRcdFx0LmZpbHRlcigobmFtZSkgPT4gbmFtZSBpbiBjaGFuZ2VzKVxuXHRcdFx0LmZvckVhY2goKG5hbWUpID0+IChpbnB1dHNbbmFtZV0gPSB0aGlzW25hbWVdKSk7XG5cdFx0dGhpcy5fc2VydmljZS5zZXQoaW5wdXRzKTtcblxuXHRcdGlmICgnc3RhcnREYXRlJyBpbiBjaGFuZ2VzKSB7XG5cdFx0XHRjb25zdCB7IGN1cnJlbnRWYWx1ZSwgcHJldmlvdXNWYWx1ZSB9ID0gY2hhbmdlcy5zdGFydERhdGU7XG5cdFx0XHRpZiAoaXNDaGFuZ2VkTW9udGgocHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlKSkge1xuXHRcdFx0XHR0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGFydERhdGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG9uRGF0ZVNlbGVjdChkYXRlOiBOZ2JEYXRlKSB7XG5cdFx0dGhpcy5fc2VydmljZS5mb2N1cyhkYXRlKTtcblx0XHR0aGlzLl9zZXJ2aWNlLnNlbGVjdChkYXRlLCB7IGVtaXRFdmVudDogdHJ1ZSB9KTtcblx0fVxuXG5cdG9uTmF2aWdhdGVEYXRlU2VsZWN0KGRhdGU6IE5nYkRhdGUpIHtcblx0XHR0aGlzLl9zZXJ2aWNlLm9wZW4oZGF0ZSk7XG5cdH1cblxuXHRvbk5hdmlnYXRlRXZlbnQoZXZlbnQ6IE5hdmlnYXRpb25FdmVudCkge1xuXHRcdHN3aXRjaCAoZXZlbnQpIHtcblx0XHRcdGNhc2UgTmF2aWdhdGlvbkV2ZW50LlBSRVY6XG5cdFx0XHRcdHRoaXMuX3NlcnZpY2Uub3Blbih0aGlzLl9jYWxlbmRhci5nZXRQcmV2KHRoaXMubW9kZWwuZmlyc3REYXRlISwgJ20nLCAxKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBOYXZpZ2F0aW9uRXZlbnQuTkVYVDpcblx0XHRcdFx0dGhpcy5fc2VydmljZS5vcGVuKHRoaXMuX2NhbGVuZGFyLmdldE5leHQodGhpcy5tb2RlbC5maXJzdERhdGUhLCAnbScsIDEpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQge1xuXHRcdHRoaXMub25DaGFuZ2UgPSBmbjtcblx0fVxuXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHtcblx0XHR0aGlzLm9uVG91Y2hlZCA9IGZuO1xuXHR9XG5cblx0c2V0RGlzYWJsZWRTdGF0ZShkaXNhYmxlZDogYm9vbGVhbikge1xuXHRcdHRoaXMuX3NlcnZpY2Uuc2V0KHsgZGlzYWJsZWQgfSk7XG5cdH1cblxuXHR3cml0ZVZhbHVlKHZhbHVlKSB7XG5cdFx0dGhpcy5fY29udHJvbFZhbHVlID0gTmdiRGF0ZS5mcm9tKHRoaXMuX25nYkRhdGVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSkpO1xuXHRcdHRoaXMuX3NlcnZpY2Uuc2VsZWN0KHRoaXMuX2NvbnRyb2xWYWx1ZSk7XG5cdH1cbn1cbiJdfQ==