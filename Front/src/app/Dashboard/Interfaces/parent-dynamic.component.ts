import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-parent-dynamic',
  templateUrl: './parent-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ParentDynamicComponent {
  @Input() widget;
  @Input() resizeEvent;
}
