import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges, } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  filterValue: string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; //Sorting logic
  @Output() itemSelectEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemAddEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemEditEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemViewEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemDeleteEvent: EventEmitter<number> = new EventEmitter();

  @Output() itemRemoveEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemColUpEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemColDownEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemUnlockEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemAnchorEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemCustomerEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemPdfEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemTranactionIDEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemExcelEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemCsvEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemResetEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemDownloadEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemRefreshEvent: EventEmitter<number> = new EventEmitter();

  @Input() positions!: boolean;
  @Input() displayedColumns?: any[];
  @Input() filterLabel?: string;
  @Input() pagination?: boolean;
  @Input() channelp!: boolean;
  @Input() searchGrid?: boolean;
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() addNew!: boolean;
  @Input() addUser: boolean = false;
  @Input() addChannel: boolean = false;
  @Input() addRole: boolean = false;
  @Input() addSystem: boolean = false;
  @Input() defaultSort?: string;
  @Input() tableType!: string;
  @Input() editable!: boolean;
  @Input() view!: boolean;
  @Input() deletable!: boolean;
  @Input() pdf!: boolean;
  @Input() excel!: boolean;
  @Input() csv!: boolean;

  columns: string[] = [];
  showMe: boolean = false;
  isEditable: boolean = false;
  userId: any;
  isAdmin: boolean = false;
  filterText?: string;
  dialog: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private helper: HelperService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns?.forEach((val) => {
      this.columns.push(val.name);
    });
    const permissions = this.userService?.userSessionData?.data?.user?.roles
      ?.map((t: any) => t.permissions.map((f: any) => f.id))
      .flat();
    this.userId = this.userService?.userSessionData?.data?.user?.id;
    this.isAdmin = permissions?.some((item: any) =>
      permissions?.includes('super-user')
    );
    this.isEditable = permissions?.some((item: any) =>
      permissions?.includes('manage-' + this.tableType)
    );
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      if (this.defaultSort) {
        const sortState: Sort = { active: this.defaultSort, direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      if (this.defaultSort) {
        const sortState: Sort = { active: this.defaultSort, direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
      this.dataSource.paginator = this.paginator;
    }
  }

  txnStatusMapping: { [key: string]: string } = {
    'N': 'NEW',
    'A': 'ACKNOWLEDGED',
    'P': 'PENDING',
    'I': 'INITIATED',
    'V': 'REJECTED',
    'R': 'REVERSED',
    'C': 'COMPLETED',
    'S': 'SUSPECTED'
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(id: number) {
    this.itemEditEvent.emit(id);
  }

  onView(id: number) {
    this.itemViewEvent.emit(id);
  }

  onDelete(id: any) {
    this.itemDeleteEvent.emit(id);
  }

  onpublicKeyDownload(element: any) {
    this.itemDownloadEvent.emit(element);
  }

  ondownloadResponse(element: any) {
    this.itemDownloadEvent.emit(element);
  }

  onRefresh(element: any) {
    this.itemRefreshEvent.emit(element);
  }

  onAdd() {
    this.itemAddEvent.emit();
  }
  downloadAsPDF() {
    this.itemPdfEvent.emit();
  }
  exportAsXLSX() {
    this.itemExcelEvent.emit();
  }
  downloadAsCSV() {
    this.itemCsvEvent.emit();
  }

  onCustomerClick(id: any) {
    this.itemCustomerEvent.emit(id)
  }

  onTxnIdClick(id: any) {
    this.itemTranactionIDEvent.emit(id)
  }
  
  adduser() {
    this.router.navigate(['usermanagement/add']);
  }
  addchannel() {
    this.router.navigate(['channels/add']);
  }
  addrole() {
    this.router.navigate(['rolemanagement/add']);
  }
  addreport() {
    this.router.navigate(['rolemanagement/add']);
  }
  addsystems() {
    this.router.navigate(['systemconfig/add']);
  }
  toggletag() {
    this.showMe = !this.showMe;
  }

}
