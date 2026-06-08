import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { UserService } from "../services/user.service";

@Directive({
  selector: '[checkRole]'
})
export class CheckPermissionDirective {
  @Input() checkRole: string | undefined;

  stop$ = new Subject();

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    if (this.checkRole == '' || this.checkRole == null) {
      this.isVisible = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      return;
    }
    const permissions = this.userService?.userPermissions;
    let hasPermission = false;
    for (const x of this.checkRole.split(',')) {
      hasPermission = permissions?.some((item: any) => x == item.id);
      if (hasPermission) {
        break;
      }
    }

    if (hasPermission) {
      this.viewContainerRef.clear();
    }

    if (hasPermission) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  };

}
