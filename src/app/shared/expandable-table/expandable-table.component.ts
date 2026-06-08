import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { UserService } from 'src/app/services/user.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-expandable-table',
  templateUrl: './expandable-table.component.html',
  styleUrls: ['./expandable-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExpandableTableComponent implements OnInit, AfterViewInit, OnChanges{
  columns!: Array<any>;
  columnsToDisplay!: Array<any>;
  columnsToDisplayWithExpand!: Array<any>;
  expandedElement: any;
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() searchGrid!: boolean;
  @Input() selectGrid!: boolean;
  @Input() filterLabel!: string;
  @Input() deletable!: boolean;
  @Input() editable!: boolean;
  @Input() defaultSort!: string;
  @Input() pagination!: boolean;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Output() itemEditEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemDeleteEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemAnchorEvent: EventEmitter<any> = new EventEmitter();

  @Input('displayedColumns')
  set _displayedColumns(data: Array<any>) {
    this.columns = data;
    this.columnsToDisplay = data
    const permissions = this.userService?.userSessionData?.data?.user?.roles?.map((t: any) => t.permissions.map((f: any) => f.id)).flat();
    let isManageMerchant = permissions?.some((item: any) => permissions?.includes('super-user') || permissions?.includes('manage-merchant'));
    if (isManageMerchant) {
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay.map(t => t.name), 'expand', 'action'];
    } else {
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay.map(t => t.name), 'expand'];
    }
  }

  filterText!: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    if (this.defaultSort) {
      const sortState: Sort = { active: this.defaultSort, direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.sort = this.sort;
    if (this.sort && this.defaultSort) {
      const sortState: Sort = { active: this.defaultSort, direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onAnchorClick(row: any) {
    this.itemAnchorEvent.emit(row);
  }
  isExpanded(element: any) {
    element['expanded'] = !element['expanded'];

  }
  onEdit(row: any) {
    this.itemEditEvent.emit(row);
  }

  onDelete(id: any) {
    this.itemDeleteEvent.emit(id);
  }

}
