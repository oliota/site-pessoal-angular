import { DOCUMENT } from '@angular/common';
import { createComponent, EnvironmentInjector, EventEmitter, Inject, Injectable, Injector, TemplateRef, } from '@angular/core';
import { Subject } from 'rxjs';
import { ngbFocusTrap } from '../util/focus-trap';
import { ContentRef } from '../util/popup';
import { isDefined, isString } from '../util/util';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbActiveModal, NgbModalRef } from './modal-ref';
import { NgbModalWindow } from './modal-window';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../util/scrollbar";
export class NgbModalStack {
    constructor(_applicationRef, _injector, _environmentInjector, _document, _scrollBar, _rendererFactory, _ngZone) {
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._environmentInjector = _environmentInjector;
        this._document = _document;
        this._scrollBar = _scrollBar;
        this._rendererFactory = _rendererFactory;
        this._ngZone = _ngZone;
        this._activeWindowCmptHasChanged = new Subject();
        this._ariaHiddenValues = new Map();
        this._scrollBarRestoreFn = null;
        this._backdropAttributes = ['animation', 'backdropClass'];
        this._modalRefs = [];
        this._windowAttributes = [
            'animation',
            'ariaLabelledBy',
            'ariaDescribedBy',
            'backdrop',
            'centered',
            'fullscreen',
            'keyboard',
            'scrollable',
            'size',
            'windowClass',
            'modalDialogClass',
        ];
        this._windowCmpts = [];
        this._activeInstances = new EventEmitter();
        // Trap focus on active WindowCmpt
        this._activeWindowCmptHasChanged.subscribe(() => {
            if (this._windowCmpts.length) {
                const activeWindowCmpt = this._windowCmpts[this._windowCmpts.length - 1];
                ngbFocusTrap(this._ngZone, activeWindowCmpt.location.nativeElement, this._activeWindowCmptHasChanged);
                this._revertAriaHidden();
                this._setAriaHidden(activeWindowCmpt.location.nativeElement);
            }
        });
    }
    _restoreScrollBar() {
        const scrollBarRestoreFn = this._scrollBarRestoreFn;
        if (scrollBarRestoreFn) {
            this._scrollBarRestoreFn = null;
            scrollBarRestoreFn();
        }
    }
    _hideScrollBar() {
        if (!this._scrollBarRestoreFn) {
            this._scrollBarRestoreFn = this._scrollBar.hide();
        }
    }
    open(contentInjector, content, options) {
        const containerEl = options.container instanceof HTMLElement
            ? options.container
            : isDefined(options.container)
                ? this._document.querySelector(options.container)
                : this._document.body;
        const renderer = this._rendererFactory.createRenderer(null, null);
        if (!containerEl) {
            throw new Error(`The specified modal container "${options.container || 'body'}" was not found in the DOM.`);
        }
        this._hideScrollBar();
        const activeModal = new NgbActiveModal();
        contentInjector = options.injector || contentInjector;
        const environmentInjector = contentInjector.get(EnvironmentInjector, null) || this._environmentInjector;
        const contentRef = this._getContentRef(contentInjector, environmentInjector, content, activeModal, options);
        let backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(containerEl) : undefined;
        let windowCmptRef = this._attachWindowComponent(containerEl, contentRef.nodes);
        let ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        this._registerModalRef(ngbModalRef);
        this._registerWindowCmpt(windowCmptRef);
        // We have to cleanup DOM after the last modal when BOTH 'hidden' was emitted and 'result' promise was resolved:
        // - with animations OFF, 'hidden' emits synchronously, then 'result' is resolved asynchronously
        // - with animations ON, 'result' is resolved asynchronously, then 'hidden' emits asynchronously
        ngbModalRef.hidden.pipe(take(1)).subscribe(() => Promise.resolve(true).then(() => {
            if (!this._modalRefs.length) {
                renderer.removeClass(this._document.body, 'modal-open');
                this._restoreScrollBar();
                this._revertAriaHidden();
            }
        }));
        activeModal.close = (result) => {
            ngbModalRef.close(result);
        };
        activeModal.dismiss = (reason) => {
            ngbModalRef.dismiss(reason);
        };
        this._applyWindowOptions(windowCmptRef.instance, options);
        if (this._modalRefs.length === 1) {
            renderer.addClass(this._document.body, 'modal-open');
        }
        if (backdropCmptRef && backdropCmptRef.instance) {
            this._applyBackdropOptions(backdropCmptRef.instance, options);
            backdropCmptRef.changeDetectorRef.detectChanges();
        }
        windowCmptRef.changeDetectorRef.detectChanges();
        return ngbModalRef;
    }
    get activeInstances() {
        return this._activeInstances;
    }
    dismissAll(reason) {
        this._modalRefs.forEach((ngbModalRef) => ngbModalRef.dismiss(reason));
    }
    hasOpenModals() {
        return this._modalRefs.length > 0;
    }
    _attachBackdrop(containerEl) {
        let backdropCmptRef = createComponent(NgbModalBackdrop, {
            environmentInjector: this._applicationRef.injector,
            elementInjector: this._injector,
        });
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }
    _attachWindowComponent(containerEl, projectableNodes) {
        let windowCmptRef = createComponent(NgbModalWindow, {
            environmentInjector: this._applicationRef.injector,
            elementInjector: this._injector,
            projectableNodes,
        });
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    }
    _applyWindowOptions(windowInstance, options) {
        this._windowAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    _applyBackdropOptions(backdropInstance, options) {
        this._backdropAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    }
    _getContentRef(contentInjector, environmentInjector, content, activeModal, options) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, activeModal);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(contentInjector, environmentInjector, content, activeModal, options);
        }
    }
    _createFromTemplateRef(templateRef, activeModal) {
        const context = {
            $implicit: activeModal,
            close(result) {
                activeModal.close(result);
            },
            dismiss(reason) {
                activeModal.dismiss(reason);
            },
        };
        const viewRef = templateRef.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }
    _createFromString(content) {
        const component = this._document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }
    _createFromComponent(contentInjector, environmentInjector, componentType, context, options) {
        const elementInjector = Injector.create({
            providers: [{ provide: NgbActiveModal, useValue: context }],
            parent: contentInjector,
        });
        const componentRef = createComponent(componentType, {
            environmentInjector,
            elementInjector,
        });
        const componentNativeEl = componentRef.location.nativeElement;
        if (options.scrollable) {
            componentNativeEl.classList.add('component-host-scrollable');
        }
        this._applicationRef.attachView(componentRef.hostView);
        // FIXME: we should here get rid of the component nativeElement
        // and use `[Array.from(componentNativeEl.childNodes)]` instead and remove the above CSS class.
        return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
    }
    _setAriaHidden(element) {
        const parent = element.parentElement;
        if (parent && element !== this._document.body) {
            Array.from(parent.children).forEach((sibling) => {
                if (sibling !== element && sibling.nodeName !== 'SCRIPT') {
                    this._ariaHiddenValues.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            });
            this._setAriaHidden(parent);
        }
    }
    _revertAriaHidden() {
        this._ariaHiddenValues.forEach((value, element) => {
            if (value) {
                element.setAttribute('aria-hidden', value);
            }
            else {
                element.removeAttribute('aria-hidden');
            }
        });
        this._ariaHiddenValues.clear();
    }
    _registerModalRef(ngbModalRef) {
        const unregisterModalRef = () => {
            const index = this._modalRefs.indexOf(ngbModalRef);
            if (index > -1) {
                this._modalRefs.splice(index, 1);
                this._activeInstances.emit(this._modalRefs);
            }
        };
        this._modalRefs.push(ngbModalRef);
        this._activeInstances.emit(this._modalRefs);
        ngbModalRef.result.then(unregisterModalRef, unregisterModalRef);
    }
    _registerWindowCmpt(ngbWindowCmpt) {
        this._windowCmpts.push(ngbWindowCmpt);
        this._activeWindowCmptHasChanged.next();
        ngbWindowCmpt.onDestroy(() => {
            const index = this._windowCmpts.indexOf(ngbWindowCmpt);
            if (index > -1) {
                this._windowCmpts.splice(index, 1);
                this._activeWindowCmptHasChanged.next();
            }
        });
    }
}
NgbModalStack.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModalStack, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: i0.EnvironmentInjector }, { token: DOCUMENT }, { token: i1.ScrollBar }, { token: i0.RendererFactory2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModalStack.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModalStack, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModalStack, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: i0.EnvironmentInjector }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.ScrollBar }, { type: i0.RendererFactory2 }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kYWwvbW9kYWwtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTixlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUNWLFFBQVEsRUFHUixXQUFXLEdBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFHdEMsTUFBTSxPQUFPLGFBQWE7SUFzQnpCLFlBQ1MsZUFBK0IsRUFDL0IsU0FBbUIsRUFDbkIsb0JBQXlDLEVBQ3ZCLFNBQWMsRUFDaEMsVUFBcUIsRUFDckIsZ0JBQWtDLEVBQ2xDLE9BQWU7UUFOZixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFDL0IsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXFCO1FBQ3ZCLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDaEMsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUNyQixxQkFBZ0IsR0FBaEIs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QUFFLE1BQU0sRUFBRTs7MEJBMkIvQixNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuXHRBcHBsaWNhdGlvblJlZixcblx0Q29tcG9uZW50UmVmLFxuXHRjcmVhdGVDb21wb25lbnQsXG5cdEVudmlyb25tZW50SW5qZWN0b3IsXG5cdEV2ZW50RW1pdHRlcixcblx0SW5qZWN0LFxuXHRJbmplY3RhYmxlLFxuXHRJbmplY3Rvcixcblx0Tmdab25lLFxuXHRSZW5kZXJlckZhY3RvcnkyLFxuXHRUZW1wbGF0ZVJlZixcblx0VHlwZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IG5nYkZvY3VzVHJhcCB9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5pbXBvcnQgeyBDb250ZW50UmVmIH0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQgeyBTY3JvbGxCYXIgfSBmcm9tICcuLi91dGlsL3Njcm9sbGJhcic7XG5pbXBvcnQgeyBpc0RlZmluZWQsIGlzU3RyaW5nIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE5nYk1vZGFsQmFja2Ryb3AgfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7IE5nYk1vZGFsT3B0aW9ucyB9IGZyb20gJy4vbW9kYWwtY29uZmlnJztcbmltcG9ydCB7IE5nYkFjdGl2ZU1vZGFsLCBOZ2JNb2RhbFJlZiB9IGZyb20gJy4vbW9kYWwtcmVmJztcbmltcG9ydCB7IE5nYk1vZGFsV2luZG93IH0gZnJvbSAnLi9tb2RhbC13aW5kb3cnO1xuaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFN0YWNrIHtcblx0cHJpdmF0ZSBfYWN0aXZlV2luZG93Q21wdEhhc0NoYW5nZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXHRwcml2YXRlIF9hcmlhSGlkZGVuVmFsdWVzOiBNYXA8RWxlbWVudCwgc3RyaW5nIHwgbnVsbD4gPSBuZXcgTWFwKCk7XG5cdHByaXZhdGUgX3Njcm9sbEJhclJlc3RvcmVGbjogbnVsbCB8ICgoKSA9PiB2b2lkKSA9IG51bGw7XG5cdHByaXZhdGUgX2JhY2tkcm9wQXR0cmlidXRlcyA9IFsnYW5pbWF0aW9uJywgJ2JhY2tkcm9wQ2xhc3MnXTtcblx0cHJpdmF0ZSBfbW9kYWxSZWZzOiBOZ2JNb2RhbFJlZltdID0gW107XG5cdHByaXZhdGUgX3dpbmRvd0F0dHJpYnV0ZXMgPSBbXG5cdFx0J2FuaW1hdGlvbicsXG5cdFx0J2FyaWFMYWJlbGxlZEJ5Jyxcblx0XHQnYXJpYURlc2NyaWJlZEJ5Jyxcblx0XHQnYmFja2Ryb3AnLFxuXHRcdCdjZW50ZXJlZCcsXG5cdFx0J2Z1bGxzY3JlZW4nLFxuXHRcdCdrZXlib2FyZCcsXG5cdFx0J3Njcm9sbGFibGUnLFxuXHRcdCdzaXplJyxcblx0XHQnd2luZG93Q2xhc3MnLFxuXHRcdCdtb2RhbERpYWxvZ0NsYXNzJyxcblx0XTtcblx0cHJpdmF0ZSBfd2luZG93Q21wdHM6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz5bXSA9IFtdO1xuXHRwcml2YXRlIF9hY3RpdmVJbnN0YW5jZXM6IEV2ZW50RW1pdHRlcjxOZ2JNb2RhbFJlZltdPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIF9hcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXG5cdFx0cHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuXHRcdHByaXZhdGUgX2Vudmlyb25tZW50SW5qZWN0b3I6IEVudmlyb25tZW50SW5qZWN0b3IsXG5cdFx0QEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcblx0XHRwcml2YXRlIF9zY3JvbGxCYXI6IFNjcm9sbEJhcixcblx0XHRwcml2YXRlIF9yZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTIsXG5cdFx0cHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG5cdCkge1xuXHRcdC8vIFRyYXAgZm9jdXMgb24gYWN0aXZlIFdpbmRvd0NtcHRcblx0XHR0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZC5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuX3dpbmRvd0NtcHRzLmxlbmd0aCkge1xuXHRcdFx0XHRjb25zdCBhY3RpdmVXaW5kb3dDbXB0ID0gdGhpcy5fd2luZG93Q21wdHNbdGhpcy5fd2luZG93Q21wdHMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdG5nYkZvY3VzVHJhcCh0aGlzLl9uZ1pvbmUsIGFjdGl2ZVdpbmRvd0NtcHQubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5fYWN0aXZlV2luZG93Q21wdEhhc0NoYW5nZWQpO1xuXHRcdFx0XHR0aGlzLl9yZXZlcnRBcmlhSGlkZGVuKCk7XG5cdFx0XHRcdHRoaXMuX3NldEFyaWFIaWRkZW4oYWN0aXZlV2luZG93Q21wdC5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX3Jlc3RvcmVTY3JvbGxCYXIoKSB7XG5cdFx0Y29uc3Qgc2Nyb2xsQmFyUmVzdG9yZUZuID0gdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuO1xuXHRcdGlmIChzY3JvbGxCYXJSZXN0b3JlRm4pIHtcblx0XHRcdHRoaXMuX3Njcm9sbEJhclJlc3RvcmVGbiA9IG51bGw7XG5cdFx0XHRzY3JvbGxCYXJSZXN0b3JlRm4oKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9oaWRlU2Nyb2xsQmFyKCkge1xuXHRcdGlmICghdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuKSB7XG5cdFx0XHR0aGlzLl9zY3JvbGxCYXJSZXN0b3JlRm4gPSB0aGlzLl9zY3JvbGxCYXIuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdG9wZW4oY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LCBvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMpOiBOZ2JNb2RhbFJlZiB7XG5cdFx0Y29uc3QgY29udGFpbmVyRWwgPVxuXHRcdFx0b3B0aW9ucy5jb250YWluZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuXHRcdFx0XHQ/IG9wdGlvbnMuY29udGFpbmVyXG5cdFx0XHRcdDogaXNEZWZpbmVkKG9wdGlvbnMuY29udGFpbmVyKVxuXHRcdFx0XHQ/IHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5jb250YWluZXIpXG5cdFx0XHRcdDogdGhpcy5fZG9jdW1lbnQuYm9keTtcblx0XHRjb25zdCByZW5kZXJlciA9IHRoaXMuX3JlbmRlcmVyRmFjdG9yeS5jcmVhdGVSZW5kZXJlcihudWxsLCBudWxsKTtcblxuXHRcdGlmICghY29udGFpbmVyRWwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVGhlIHNwZWNpZmllZCBtb2RhbCBjb250YWluZXIgXCIke29wdGlvbnMuY29udGFpbmVyIHx8ICdib2R5J31cIiB3YXMgbm90IGZvdW5kIGluIHRoZSBET00uYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5faGlkZVNjcm9sbEJhcigpO1xuXG5cdFx0Y29uc3QgYWN0aXZlTW9kYWwgPSBuZXcgTmdiQWN0aXZlTW9kYWwoKTtcblxuXHRcdGNvbnRlbnRJbmplY3RvciA9IG9wdGlvbnMuaW5qZWN0b3IgfHwgY29udGVudEluamVjdG9yO1xuXHRcdGNvbnN0IGVudmlyb25tZW50SW5qZWN0b3IgPSBjb250ZW50SW5qZWN0b3IuZ2V0KEVudmlyb25tZW50SW5qZWN0b3IsIG51bGwpIHx8IHRoaXMuX2Vudmlyb25tZW50SW5qZWN0b3I7XG5cdFx0Y29uc3QgY29udGVudFJlZiA9IHRoaXMuX2dldENvbnRlbnRSZWYoY29udGVudEluamVjdG9yLCBlbnZpcm9ubWVudEluamVjdG9yLCBjb250ZW50LCBhY3RpdmVNb2RhbCwgb3B0aW9ucyk7XG5cblx0XHRsZXQgYmFja2Ryb3BDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiTW9kYWxCYWNrZHJvcD4gfCB1bmRlZmluZWQgPVxuXHRcdFx0b3B0aW9ucy5iYWNrZHJvcCAhPT0gZmFsc2UgPyB0aGlzLl9hdHRhY2hCYWNrZHJvcChjb250YWluZXJFbCkgOiB1bmRlZmluZWQ7XG5cdFx0bGV0IHdpbmRvd0NtcHRSZWY6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz4gPSB0aGlzLl9hdHRhY2hXaW5kb3dDb21wb25lbnQoY29udGFpbmVyRWwsIGNvbnRlbnRSZWYubm9kZXMpO1xuXHRcdGxldCBuZ2JNb2RhbFJlZjogTmdiTW9kYWxSZWYgPSBuZXcgTmdiTW9kYWxSZWYod2luZG93Q21wdFJlZiwgY29udGVudFJlZiwgYmFja2Ryb3BDbXB0UmVmLCBvcHRpb25zLmJlZm9yZURpc21pc3MpO1xuXG5cdFx0dGhpcy5fcmVnaXN0ZXJNb2RhbFJlZihuZ2JNb2RhbFJlZik7XG5cdFx0dGhpcy5fcmVnaXN0ZXJXaW5kb3dDbXB0KHdpbmRvd0NtcHRSZWYpO1xuXG5cdFx0Ly8gV2UgaGF2ZSB0byBjbGVhbnVwIERPTSBhZnRlciB0aGUgbGFzdCBtb2RhbCB3aGVuIEJPVEggJ2hpZGRlbicgd2FzIGVtaXR0ZWQgYW5kICdyZXN1bHQnIHByb21pc2Ugd2FzIHJlc29sdmVkOlxuXHRcdC8vIC0gd2l0aCBhbmltYXRpb25zIE9GRiwgJ2hpZGRlbicgZW1pdHMgc3luY2hyb25vdXNseSwgdGhlbiAncmVzdWx0JyBpcyByZXNvbHZlZCBhc3luY2hyb25vdXNseVxuXHRcdC8vIC0gd2l0aCBhbmltYXRpb25zIE9OLCAncmVzdWx0JyBpcyByZXNvbHZlZCBhc3luY2hyb25vdXNseSwgdGhlbiAnaGlkZGVuJyBlbWl0cyBhc3luY2hyb25vdXNseVxuXHRcdG5nYk1vZGFsUmVmLmhpZGRlbi5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PlxuXHRcdFx0UHJvbWlzZS5yZXNvbHZlKHRydWUpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXMuX21vZGFsUmVmcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9kb2N1bWVudC5ib2R5LCAnbW9kYWwtb3BlbicpO1xuXHRcdFx0XHRcdHRoaXMuX3Jlc3RvcmVTY3JvbGxCYXIoKTtcblx0XHRcdFx0XHR0aGlzLl9yZXZlcnRBcmlhSGlkZGVuKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pLFxuXHRcdCk7XG5cblx0XHRhY3RpdmVNb2RhbC5jbG9zZSA9IChyZXN1bHQ6IGFueSkgPT4ge1xuXHRcdFx0bmdiTW9kYWxSZWYuY2xvc2UocmVzdWx0KTtcblx0XHR9O1xuXHRcdGFjdGl2ZU1vZGFsLmRpc21pc3MgPSAocmVhc29uOiBhbnkpID0+IHtcblx0XHRcdG5nYk1vZGFsUmVmLmRpc21pc3MocmVhc29uKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5fYXBwbHlXaW5kb3dPcHRpb25zKHdpbmRvd0NtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuXHRcdGlmICh0aGlzLl9tb2RhbFJlZnMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRyZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9kb2N1bWVudC5ib2R5LCAnbW9kYWwtb3BlbicpO1xuXHRcdH1cblxuXHRcdGlmIChiYWNrZHJvcENtcHRSZWYgJiYgYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlKSB7XG5cdFx0XHR0aGlzLl9hcHBseUJhY2tkcm9wT3B0aW9ucyhiYWNrZHJvcENtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuXHRcdFx0YmFja2Ryb3BDbXB0UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblx0XHR9XG5cdFx0d2luZG93Q21wdFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cdFx0cmV0dXJuIG5nYk1vZGFsUmVmO1xuXHR9XG5cblx0Z2V0IGFjdGl2ZUluc3RhbmNlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fYWN0aXZlSW5zdGFuY2VzO1xuXHR9XG5cblx0ZGlzbWlzc0FsbChyZWFzb24/OiBhbnkpIHtcblx0XHR0aGlzLl9tb2RhbFJlZnMuZm9yRWFjaCgobmdiTW9kYWxSZWYpID0+IG5nYk1vZGFsUmVmLmRpc21pc3MocmVhc29uKSk7XG5cdH1cblxuXHRoYXNPcGVuTW9kYWxzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9tb2RhbFJlZnMubGVuZ3RoID4gMDtcblx0fVxuXG5cdHByaXZhdGUgX2F0dGFjaEJhY2tkcm9wKGNvbnRhaW5lckVsOiBFbGVtZW50KTogQ29tcG9uZW50UmVmPE5nYk1vZGFsQmFja2Ryb3A+IHtcblx0XHRsZXQgYmFja2Ryb3BDbXB0UmVmID0gY3JlYXRlQ29tcG9uZW50KE5nYk1vZGFsQmFja2Ryb3AsIHtcblx0XHRcdGVudmlyb25tZW50SW5qZWN0b3I6IHRoaXMuX2FwcGxpY2F0aW9uUmVmLmluamVjdG9yLFxuXHRcdFx0ZWxlbWVudEluamVjdG9yOiB0aGlzLl9pbmplY3Rvcixcblx0XHR9KTtcblx0XHR0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGJhY2tkcm9wQ21wdFJlZi5ob3N0Vmlldyk7XG5cdFx0Y29udGFpbmVyRWwuYXBwZW5kQ2hpbGQoYmFja2Ryb3BDbXB0UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdHJldHVybiBiYWNrZHJvcENtcHRSZWY7XG5cdH1cblxuXHRwcml2YXRlIF9hdHRhY2hXaW5kb3dDb21wb25lbnQoY29udGFpbmVyRWw6IEVsZW1lbnQsIHByb2plY3RhYmxlTm9kZXM6IE5vZGVbXVtdKTogQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PiB7XG5cdFx0bGV0IHdpbmRvd0NtcHRSZWYgPSBjcmVhdGVDb21wb25lbnQoTmdiTW9kYWxXaW5kb3csIHtcblx0XHRcdGVudmlyb25tZW50SW5qZWN0b3I6IHRoaXMuX2FwcGxpY2F0aW9uUmVmLmluamVjdG9yLFxuXHRcdFx0ZWxlbWVudEluamVjdG9yOiB0aGlzLl9pbmplY3Rvcixcblx0XHRcdHByb2plY3RhYmxlTm9kZXMsXG5cdFx0fSk7XG5cdFx0dGhpcy5fYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyh3aW5kb3dDbXB0UmVmLmhvc3RWaWV3KTtcblx0XHRjb250YWluZXJFbC5hcHBlbmRDaGlsZCh3aW5kb3dDbXB0UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdHJldHVybiB3aW5kb3dDbXB0UmVmO1xuXHR9XG5cblx0cHJpdmF0ZSBfYXBwbHlXaW5kb3dPcHRpb25zKHdpbmRvd0luc3RhbmNlOiBOZ2JNb2RhbFdpbmRvdywgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zKTogdm9pZCB7XG5cdFx0dGhpcy5fd2luZG93QXR0cmlidXRlcy5mb3JFYWNoKChvcHRpb25OYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdGlmIChpc0RlZmluZWQob3B0aW9uc1tvcHRpb25OYW1lXSkpIHtcblx0XHRcdFx0d2luZG93SW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSBvcHRpb25zW29wdGlvbk5hbWVdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfYXBwbHlCYWNrZHJvcE9wdGlvbnMoYmFja2Ryb3BJbnN0YW5jZTogTmdiTW9kYWxCYWNrZHJvcCwgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zKTogdm9pZCB7XG5cdFx0dGhpcy5fYmFja2Ryb3BBdHRyaWJ1dGVzLmZvckVhY2goKG9wdGlvbk5hbWU6IHN0cmluZykgPT4ge1xuXHRcdFx0aWYgKGlzRGVmaW5lZChvcHRpb25zW29wdGlvbk5hbWVdKSkge1xuXHRcdFx0XHRiYWNrZHJvcEluc3RhbmNlW29wdGlvbk5hbWVdID0gb3B0aW9uc1tvcHRpb25OYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2dldENvbnRlbnRSZWYoXG5cdFx0Y29udGVudEluamVjdG9yOiBJbmplY3Rvcixcblx0XHRlbnZpcm9ubWVudEluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yLFxuXHRcdGNvbnRlbnQ6IFR5cGU8YW55PiB8IFRlbXBsYXRlUmVmPGFueT4gfCBzdHJpbmcsXG5cdFx0YWN0aXZlTW9kYWw6IE5nYkFjdGl2ZU1vZGFsLFxuXHRcdG9wdGlvbnM6IE5nYk1vZGFsT3B0aW9ucyxcblx0KTogQ29udGVudFJlZiB7XG5cdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHRyZXR1cm4gbmV3IENvbnRlbnRSZWYoW10pO1xuXHRcdH0gZWxzZSBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlRnJvbVRlbXBsYXRlUmVmKGNvbnRlbnQsIGFjdGl2ZU1vZGFsKTtcblx0XHR9IGVsc2UgaWYgKGlzU3RyaW5nKGNvbnRlbnQpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlRnJvbVN0cmluZyhjb250ZW50KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZUZyb21Db21wb25lbnQoY29udGVudEluamVjdG9yLCBlbnZpcm9ubWVudEluamVjdG9yLCBjb250ZW50LCBhY3RpdmVNb2RhbCwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfY3JlYXRlRnJvbVRlbXBsYXRlUmVmKHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCBhY3RpdmVNb2RhbDogTmdiQWN0aXZlTW9kYWwpOiBDb250ZW50UmVmIHtcblx0XHRjb25zdCBjb250ZXh0ID0ge1xuXHRcdFx0JGltcGxpY2l0OiBhY3RpdmVNb2RhbCxcblx0XHRcdGNsb3NlKHJlc3VsdCkge1xuXHRcdFx0XHRhY3RpdmVNb2RhbC5jbG9zZShyZXN1bHQpO1xuXHRcdFx0fSxcblx0XHRcdGRpc21pc3MocmVhc29uKSB7XG5cdFx0XHRcdGFjdGl2ZU1vZGFsLmRpc21pc3MocmVhc29uKTtcblx0XHRcdH0sXG5cdFx0fTtcblx0XHRjb25zdCB2aWV3UmVmID0gdGVtcGxhdGVSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbnRleHQpO1xuXHRcdHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcodmlld1JlZik7XG5cdFx0cmV0dXJuIG5ldyBDb250ZW50UmVmKFt2aWV3UmVmLnJvb3ROb2Rlc10sIHZpZXdSZWYpO1xuXHR9XG5cblx0cHJpdmF0ZSBfY3JlYXRlRnJvbVN0cmluZyhjb250ZW50OiBzdHJpbmcpOiBDb250ZW50UmVmIHtcblx0XHRjb25zdCBjb21wb25lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgJHtjb250ZW50fWApO1xuXHRcdHJldHVybiBuZXcgQ29udGVudFJlZihbW2NvbXBvbmVudF1dKTtcblx0fVxuXG5cdHByaXZhdGUgX2NyZWF0ZUZyb21Db21wb25lbnQoXG5cdFx0Y29udGVudEluamVjdG9yOiBJbmplY3Rvcixcblx0XHRlbnZpcm9ubWVudEluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yLFxuXHRcdGNvbXBvbmVudFR5cGU6IFR5cGU8YW55Pixcblx0XHRjb250ZXh0OiBOZ2JBY3RpdmVNb2RhbCxcblx0XHRvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMsXG5cdCk6IENvbnRlbnRSZWYge1xuXHRcdGNvbnN0IGVsZW1lbnRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG5cdFx0XHRwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5nYkFjdGl2ZU1vZGFsLCB1c2VWYWx1ZTogY29udGV4dCB9XSxcblx0XHRcdHBhcmVudDogY29udGVudEluamVjdG9yLFxuXHRcdH0pO1xuXHRcdGNvbnN0IGNvbXBvbmVudFJlZiA9IGNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRUeXBlLCB7XG5cdFx0XHRlbnZpcm9ubWVudEluamVjdG9yLFxuXHRcdFx0ZWxlbWVudEluamVjdG9yLFxuXHRcdH0pO1xuXHRcdGNvbnN0IGNvbXBvbmVudE5hdGl2ZUVsID0gY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQ7XG5cdFx0aWYgKG9wdGlvbnMuc2Nyb2xsYWJsZSkge1xuXHRcdFx0KGNvbXBvbmVudE5hdGl2ZUVsIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuYWRkKCdjb21wb25lbnQtaG9zdC1zY3JvbGxhYmxlJyk7XG5cdFx0fVxuXHRcdHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcblx0XHQvLyBGSVhNRTogd2Ugc2hvdWxkIGhlcmUgZ2V0IHJpZCBvZiB0aGUgY29tcG9uZW50IG5hdGl2ZUVsZW1lbnRcblx0XHQvLyBhbmQgdXNlIGBbQXJyYXkuZnJvbShjb21wb25lbnROYXRpdmVFbC5jaGlsZE5vZGVzKV1gIGluc3RlYWQgYW5kIHJlbW92ZSB0aGUgYWJvdmUgQ1NTIGNsYXNzLlxuXHRcdHJldHVybiBuZXcgQ29udGVudFJlZihbW2NvbXBvbmVudE5hdGl2ZUVsXV0sIGNvbXBvbmVudFJlZi5ob3N0VmlldywgY29tcG9uZW50UmVmKTtcblx0fVxuXG5cdHByaXZhdGUgX3NldEFyaWFIaWRkZW4oZWxlbWVudDogRWxlbWVudCkge1xuXHRcdGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHRpZiAocGFyZW50ICYmIGVsZW1lbnQgIT09IHRoaXMuX2RvY3VtZW50LmJvZHkpIHtcblx0XHRcdEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5mb3JFYWNoKChzaWJsaW5nKSA9PiB7XG5cdFx0XHRcdGlmIChzaWJsaW5nICE9PSBlbGVtZW50ICYmIHNpYmxpbmcubm9kZU5hbWUgIT09ICdTQ1JJUFQnKSB7XG5cdFx0XHRcdFx0dGhpcy5fYXJpYUhpZGRlblZhbHVlcy5zZXQoc2libGluZywgc2libGluZy5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuXHRcdFx0XHRcdHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLl9zZXRBcmlhSGlkZGVuKHBhcmVudCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfcmV2ZXJ0QXJpYUhpZGRlbigpIHtcblx0XHR0aGlzLl9hcmlhSGlkZGVuVmFsdWVzLmZvckVhY2goKHZhbHVlLCBlbGVtZW50KSA9PiB7XG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdmFsdWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5fYXJpYUhpZGRlblZhbHVlcy5jbGVhcigpO1xuXHR9XG5cblx0cHJpdmF0ZSBfcmVnaXN0ZXJNb2RhbFJlZihuZ2JNb2RhbFJlZjogTmdiTW9kYWxSZWYpIHtcblx0XHRjb25zdCB1bnJlZ2lzdGVyTW9kYWxSZWYgPSAoKSA9PiB7XG5cdFx0XHRjb25zdCBpbmRleCA9IHRoaXMuX21vZGFsUmVmcy5pbmRleE9mKG5nYk1vZGFsUmVmKTtcblx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdHRoaXMuX21vZGFsUmVmcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR0aGlzLl9hY3RpdmVJbnN0YW5jZXMuZW1pdCh0aGlzLl9tb2RhbFJlZnMpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dGhpcy5fbW9kYWxSZWZzLnB1c2gobmdiTW9kYWxSZWYpO1xuXHRcdHRoaXMuX2FjdGl2ZUluc3RhbmNlcy5lbWl0KHRoaXMuX21vZGFsUmVmcyk7XG5cdFx0bmdiTW9kYWxSZWYucmVzdWx0LnRoZW4odW5yZWdpc3Rlck1vZGFsUmVmLCB1bnJlZ2lzdGVyTW9kYWxSZWYpO1xuXHR9XG5cblx0cHJpdmF0ZSBfcmVnaXN0ZXJXaW5kb3dDbXB0KG5nYldpbmRvd0NtcHQ6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz4pIHtcblx0XHR0aGlzLl93aW5kb3dDbXB0cy5wdXNoKG5nYldpbmRvd0NtcHQpO1xuXHRcdHRoaXMuX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkLm5leHQoKTtcblxuXHRcdG5nYldpbmRvd0NtcHQub25EZXN0cm95KCgpID0+IHtcblx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5fd2luZG93Q21wdHMuaW5kZXhPZihuZ2JXaW5kb3dDbXB0KTtcblx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdHRoaXMuX3dpbmRvd0NtcHRzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkLm5leHQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuIl19