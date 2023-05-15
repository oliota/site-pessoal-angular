import { of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPromise } from '../util/util';
/**
 * A reference to the currently opened (active) modal.
 *
 * Instances of this class can be injected into your component passed as modal content.
 * So you can `.close()` or `.dismiss()` the modal window from your component.
 */
export class NgbActiveModal {
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbModalRef.result` promise will be resolved with the provided value.
     */
    close(result) { }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) { }
}
/**
 * A reference to the newly opened modal returned by the `NgbModal.open()` method.
 */
export class NgbModalRef {
    constructor(_windowCmptRef, _contentRef, _backdropCmptRef, _beforeDismiss) {
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        this._beforeDismiss = _beforeDismiss;
        this._closed = new Subject();
        this._dismissed = new Subject();
        this._hidden = new Subject();
        _windowCmptRef.instance.dismissEvent.subscribe((reason) => {
            this.dismiss(reason);
        });
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    /**
     * The instance of a component used for the modal content.
     *
     * When a `TemplateRef` is used as the content or when the modal is closed, will return `undefined`.
     */
    get componentInstance() {
        if (this._contentRef && this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * The observable that emits when the modal is closed via the `.close()` method.
     *
     * It will emit the result passed to the `.close()` method.
     *
     * @since 8.0.0
     */
    get closed() {
        return this._closed.asObservable().pipe(takeUntil(this._hidden));
    }
    /**
     * The observable that emits when the modal is dismissed via the `.dismiss()` method.
     *
     * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
     * reasons like backdrop click or ESC key press.
     *
     * @since 8.0.0
     */
    get dismissed() {
        return this._dismissed.asObservable().pipe(takeUntil(this._hidden));
    }
    /**
     * The observable that emits when both modal window and backdrop are closed and animations were finished.
     * At this point modal and backdrop elements will be removed from the DOM tree.
     *
     * This observable will be completed after emitting.
     *
     * @since 8.0.0
     */
    get hidden() {
        return this._hidden.asObservable();
    }
    /**
     * The observable that emits when modal is fully visible and animation was finished.
     * Modal DOM element is always available synchronously after calling 'modal.open()' service.
     *
     * This observable will be completed after emitting.
     * It will not emit, if modal is closed before open animation is finished.
     *
     * @since 8.0.0
     */
    get shown() {
        return this._windowCmptRef.instance.shown.asObservable();
    }
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbMobalRef.result` promise will be resolved with the provided value.
     */
    close(result) {
        if (this._windowCmptRef) {
            this._closed.next(result);
            this._resolve(result);
            this._removeModalElements();
        }
    }
    _dismiss(reason) {
        this._dismissed.next(reason);
        this._reject(reason);
        this._removeModalElements();
    }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) {
        if (this._windowCmptRef) {
            if (!this._beforeDismiss) {
                this._dismiss(reason);
            }
            else {
                const dismiss = this._beforeDismiss();
                if (isPromise(dismiss)) {
                    dismiss.then((result) => {
                        if (result !== false) {
                            this._dismiss(reason);
                        }
                    }, () => { });
                }
                else if (dismiss !== false) {
                    this._dismiss(reason);
                }
            }
        }
    }
    _removeModalElements() {
        const windowTransition$ = this._windowCmptRef.instance.hide();
        const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);
        // hiding window
        windowTransition$.subscribe(() => {
            const { nativeElement } = this._windowCmptRef.location;
            nativeElement.parentNode.removeChild(nativeElement);
            this._windowCmptRef.destroy();
            if (this._contentRef && this._contentRef.viewRef) {
                this._contentRef.viewRef.destroy();
            }
            this._windowCmptRef = null;
            this._contentRef = null;
        });
        // hiding backdrop
        backdropTransition$.subscribe(() => {
            if (this._backdropCmptRef) {
                const { nativeElement } = this._backdropCmptRef.location;
                nativeElement.parentNode.removeChild(nativeElement);
                this._backdropCmptRef.destroy();
                this._backdropCmptRef = null;
            }
        });
        // all done
        zip(windowTransition$, backdropTransition$).subscribe(() => {
            this._hidden.next();
            this._hidden.complete();
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBTTNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekM7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sY0FBYztJQUMxQjs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE1BQVksSUFBUyxDQUFDO0lBRTVCOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsTUFBWSxJQUFTLENBQUM7Q0FDOUI7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBdUV2QixZQUNTLGNBQTRDLEVBQzVDLFdBQXVCLEVBQ3ZCLGdCQUFpRCxFQUNqRCxjQUFpRDtRQUhqRCxtQkFBYyxHQUFkLGNBQWMsQ0FBOEI7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQztRQUNqRCxtQkFBYyxHQUFkLGNBQWMsQ0FBbUM7UUExRWxELFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQzdCLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ2hDLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBMEVyQyxjQUFjLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtZQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUs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QUU7WUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCBTdWJqZWN0LCB6aXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTmdiTW9kYWxCYWNrZHJvcCB9IGZyb20gJy4vbW9kYWwtYmFja2Ryb3AnO1xuaW1wb3J0IHsgTmdiTW9kYWxXaW5kb3cgfSBmcm9tICcuL21vZGFsLXdpbmRvdyc7XG5cbmltcG9ydCB7IENvbnRlbnRSZWYgfSBmcm9tICcuLi91dGlsL3BvcHVwJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgKGFjdGl2ZSkgbW9kYWwuXG4gKlxuICogSW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgY2FuIGJlIGluamVjdGVkIGludG8geW91ciBjb21wb25lbnQgcGFzc2VkIGFzIG1vZGFsIGNvbnRlbnQuXG4gKiBTbyB5b3UgY2FuIGAuY2xvc2UoKWAgb3IgYC5kaXNtaXNzKClgIHRoZSBtb2RhbCB3aW5kb3cgZnJvbSB5b3VyIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIE5nYkFjdGl2ZU1vZGFsIHtcblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgbW9kYWwgd2l0aCBhbiBvcHRpb25hbCBgcmVzdWx0YCB2YWx1ZS5cblx0ICpcblx0ICogVGhlIGBOZ2JNb2RhbFJlZi5yZXN1bHRgIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cblx0ICovXG5cdGNsb3NlKHJlc3VsdD86IGFueSk6IHZvaWQge31cblxuXHQvKipcblx0ICogRGlzbWlzc2VzIHRoZSBtb2RhbCB3aXRoIGFuIG9wdGlvbmFsIGByZWFzb25gIHZhbHVlLlxuXHQgKlxuXHQgKiBUaGUgYE5nYk1vZGFsUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuXHQgKi9cblx0ZGlzbWlzcyhyZWFzb24/OiBhbnkpOiB2b2lkIHt9XG59XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gdGhlIG5ld2x5IG9wZW5lZCBtb2RhbCByZXR1cm5lZCBieSB0aGUgYE5nYk1vZGFsLm9wZW4oKWAgbWV0aG9kLlxuICovXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxSZWYge1xuXHRwcml2YXRlIF9jbG9zZWQgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG5cdHByaXZhdGUgX2Rpc21pc3NlZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblx0cHJpdmF0ZSBfaGlkZGVuID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0cHJpdmF0ZSBfcmVzb2x2ZTogKHJlc3VsdD86IGFueSkgPT4gdm9pZDtcblx0cHJpdmF0ZSBfcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBUaGUgaW5zdGFuY2Ugb2YgYSBjb21wb25lbnQgdXNlZCBmb3IgdGhlIG1vZGFsIGNvbnRlbnQuXG5cdCAqXG5cdCAqIFdoZW4gYSBgVGVtcGxhdGVSZWZgIGlzIHVzZWQgYXMgdGhlIGNvbnRlbnQgb3Igd2hlbiB0aGUgbW9kYWwgaXMgY2xvc2VkLCB3aWxsIHJldHVybiBgdW5kZWZpbmVkYC5cblx0ICovXG5cdGdldCBjb21wb25lbnRJbnN0YW5jZSgpOiBhbnkge1xuXHRcdGlmICh0aGlzLl9jb250ZW50UmVmICYmIHRoaXMuX2NvbnRlbnRSZWYuY29tcG9uZW50UmVmKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGVudFJlZi5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgbW9kYWwgaXMgY2xvc2VkIGFuZCByZWplY3RlZCB3aGVuIHRoZSBtb2RhbCBpcyBkaXNtaXNzZWQuXG5cdCAqL1xuXHRyZXN1bHQ6IFByb21pc2U8YW55PjtcblxuXHQvKipcblx0ICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBtb2RhbCBpcyBjbG9zZWQgdmlhIHRoZSBgLmNsb3NlKClgIG1ldGhvZC5cblx0ICpcblx0ICogSXQgd2lsbCBlbWl0IHRoZSByZXN1bHQgcGFzc2VkIHRvIHRoZSBgLmNsb3NlKClgIG1ldGhvZC5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRnZXQgY2xvc2VkKCk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0cmV0dXJuIHRoaXMuX2Nsb3NlZC5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9oaWRkZW4pKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1vZGFsIGlzIGRpc21pc3NlZCB2aWEgdGhlIGAuZGlzbWlzcygpYCBtZXRob2QuXG5cdCAqXG5cdCAqIEl0IHdpbGwgZW1pdCB0aGUgcmVhc29uIHBhc3NlZCB0byB0aGUgYC5kaXNtaXNzZWQoKWAgbWV0aG9kIGJ5IHRoZSB1c2VyLCBvciBvbmUgb2YgdGhlIGludGVybmFsXG5cdCAqIHJlYXNvbnMgbGlrZSBiYWNrZHJvcCBjbGljayBvciBFU0Mga2V5IHByZXNzLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdGdldCBkaXNtaXNzZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRyZXR1cm4gdGhpcy5fZGlzbWlzc2VkLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZVVudGlsKHRoaXMuX2hpZGRlbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiBib3RoIG1vZGFsIHdpbmRvdyBhbmQgYmFja2Ryb3AgYXJlIGNsb3NlZCBhbmQgYW5pbWF0aW9ucyB3ZXJlIGZpbmlzaGVkLlxuXHQgKiBBdCB0aGlzIHBvaW50IG1vZGFsIGFuZCBiYWNrZHJvcCBlbGVtZW50cyB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgRE9NIHRyZWUuXG5cdCAqXG5cdCAqIFRoaXMgb2JzZXJ2YWJsZSB3aWxsIGJlIGNvbXBsZXRlZCBhZnRlciBlbWl0dGluZy5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRnZXQgaGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLl9oaWRkZW4uYXNPYnNlcnZhYmxlKCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIG1vZGFsIGlzIGZ1bGx5IHZpc2libGUgYW5kIGFuaW1hdGlvbiB3YXMgZmluaXNoZWQuXG5cdCAqIE1vZGFsIERPTSBlbGVtZW50IGlzIGFsd2F5cyBhdmFpbGFibGUgc3luY2hyb25vdXNseSBhZnRlciBjYWxsaW5nICdtb2RhbC5vcGVuKCknIHNlcnZpY2UuXG5cdCAqXG5cdCAqIFRoaXMgb2JzZXJ2YWJsZSB3aWxsIGJlIGNvbXBsZXRlZCBhZnRlciBlbWl0dGluZy5cblx0ICogSXQgd2lsbCBub3QgZW1pdCwgaWYgbW9kYWwgaXMgY2xvc2VkIGJlZm9yZSBvcGVuIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRnZXQgc2hvd24oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG5cdFx0cmV0dXJuIHRoaXMuX3dpbmRvd0NtcHRSZWYuaW5zdGFuY2Uuc2hvd24uYXNPYnNlcnZhYmxlKCk7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIF93aW5kb3dDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+LFxuXHRcdHByaXZhdGUgX2NvbnRlbnRSZWY6IENvbnRlbnRSZWYsXG5cdFx0cHJpdmF0ZSBfYmFja2Ryb3BDbXB0UmVmPzogQ29tcG9uZW50UmVmPE5nYk1vZGFsQmFja2Ryb3A+LFxuXHRcdHByaXZhdGUgX2JlZm9yZURpc21pc3M/OiAoKSA9PiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPixcblx0KSB7XG5cdFx0X3dpbmRvd0NtcHRSZWYuaW5zdGFuY2UuZGlzbWlzc0V2ZW50LnN1YnNjcmliZSgocmVhc29uOiBhbnkpID0+IHtcblx0XHRcdHRoaXMuZGlzbWlzcyhyZWFzb24pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5yZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcblx0XHRcdHRoaXMuX3JlamVjdCA9IHJlamVjdDtcblx0XHR9KTtcblx0XHR0aGlzLnJlc3VsdC50aGVuKG51bGwsICgpID0+IHt9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9zZXMgdGhlIG1vZGFsIHdpdGggYW4gb3B0aW9uYWwgYHJlc3VsdGAgdmFsdWUuXG5cdCAqXG5cdCAqIFRoZSBgTmdiTW9iYWxSZWYucmVzdWx0YCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUuXG5cdCAqL1xuXHRjbG9zZShyZXN1bHQ/OiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2luZG93Q21wdFJlZikge1xuXHRcdFx0dGhpcy5fY2xvc2VkLm5leHQocmVzdWx0KTtcblx0XHRcdHRoaXMuX3Jlc29sdmUocmVzdWx0KTtcblx0XHRcdHRoaXMuX3JlbW92ZU1vZGFsRWxlbWVudHMoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9kaXNtaXNzKHJlYXNvbj86IGFueSkge1xuXHRcdHRoaXMuX2Rpc21pc3NlZC5uZXh0KHJlYXNvbik7XG5cdFx0dGhpcy5fcmVqZWN0KHJlYXNvbik7XG5cdFx0dGhpcy5fcmVtb3ZlTW9kYWxFbGVtZW50cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc21pc3NlcyB0aGUgbW9kYWwgd2l0aCBhbiBvcHRpb25hbCBgcmVhc29uYCB2YWx1ZS5cblx0ICpcblx0ICogVGhlIGBOZ2JNb2RhbFJlZi5yZXN1bHRgIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cblx0ICovXG5cdGRpc21pc3MocmVhc29uPzogYW55KTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX3dpbmRvd0NtcHRSZWYpIHtcblx0XHRcdGlmICghdGhpcy5fYmVmb3JlRGlzbWlzcykge1xuXHRcdFx0XHR0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBkaXNtaXNzID0gdGhpcy5fYmVmb3JlRGlzbWlzcygpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKGRpc21pc3MpKSB7XG5cdFx0XHRcdFx0ZGlzbWlzcy50aGVuKFxuXHRcdFx0XHRcdFx0KHJlc3VsdCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0ICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2Rpc21pc3MocmVhc29uKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCgpID0+IHt9LFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZGlzbWlzcyAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHR0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9yZW1vdmVNb2RhbEVsZW1lbnRzKCkge1xuXHRcdGNvbnN0IHdpbmRvd1RyYW5zaXRpb24kID0gdGhpcy5fd2luZG93Q21wdFJlZi5pbnN0YW5jZS5oaWRlKCk7XG5cdFx0Y29uc3QgYmFja2Ryb3BUcmFuc2l0aW9uJCA9IHRoaXMuX2JhY2tkcm9wQ21wdFJlZiA/IHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5pbnN0YW5jZS5oaWRlKCkgOiBvZih1bmRlZmluZWQpO1xuXG5cdFx0Ly8gaGlkaW5nIHdpbmRvd1xuXHRcdHdpbmRvd1RyYW5zaXRpb24kLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfSA9IHRoaXMuX3dpbmRvd0NtcHRSZWYubG9jYXRpb247XG5cdFx0XHRuYXRpdmVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF0aXZlRWxlbWVudCk7XG5cdFx0XHR0aGlzLl93aW5kb3dDbXB0UmVmLmRlc3Ryb3koKTtcblxuXHRcdFx0aWYgKHRoaXMuX2NvbnRlbnRSZWYgJiYgdGhpcy5fY29udGVudFJlZi52aWV3UmVmKSB7XG5cdFx0XHRcdHRoaXMuX2NvbnRlbnRSZWYudmlld1JlZi5kZXN0cm95KCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX3dpbmRvd0NtcHRSZWYgPSA8YW55Pm51bGw7XG5cdFx0XHR0aGlzLl9jb250ZW50UmVmID0gPGFueT5udWxsO1xuXHRcdH0pO1xuXG5cdFx0Ly8gaGlkaW5nIGJhY2tkcm9wXG5cdFx0YmFja2Ryb3BUcmFuc2l0aW9uJC5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuX2JhY2tkcm9wQ21wdFJlZikge1xuXHRcdFx0XHRjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfSA9IHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5sb2NhdGlvbjtcblx0XHRcdFx0bmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5hdGl2ZUVsZW1lbnQpO1xuXHRcdFx0XHR0aGlzLl9iYWNrZHJvcENtcHRSZWYuZGVzdHJveSgpO1xuXHRcdFx0XHR0aGlzLl9iYWNrZHJvcENtcHRSZWYgPSA8YW55Pm51bGw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBhbGwgZG9uZVxuXHRcdHppcCh3aW5kb3dUcmFuc2l0aW9uJCwgYmFja2Ryb3BUcmFuc2l0aW9uJCkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuX2hpZGRlbi5uZXh0KCk7XG5cdFx0XHR0aGlzLl9oaWRkZW4uY29tcGxldGUoKTtcblx0XHR9KTtcblx0fVxufVxuIl19