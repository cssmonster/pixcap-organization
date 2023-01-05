import { IEmployeeOrgApp, Employee } from "./type";

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  allStaffs: Employee[] = [];
  histories: number[][] = [];
  historyPoint: number = 0;
  maxUniqueId: number = 0;

  constructor(ceo: Employee) {
    this.ceo = ceo;
    this.allStaffs.push(this.ceo);
    this.maxUniqueId = ceo.uniqueId;
  }

  move(employeeID: number, supervisorID: number) {
    this.histories.push([employeeID, supervisorID]);
    this.historyPoint++;
    this._moveAction(employeeID, supervisorID);
  }

  undo() {
    this._reset();
    this.historyPoint = this.historyPoint > 0 ? this.historyPoint - 1 : 0;
    const resultHistory =
      this.historyPoint > 0 ? this.histories.slice(0, this.historyPoint) : [];
    resultHistory.forEach((history: number[]) => {
      this._moveByHistory(history[0], history[1]);
    });
  }

  redo() {
    this._reset();
    this.historyPoint =
      this.historyPoint < this.histories.length
        ? this.historyPoint + 1
        : this.histories.length;
    const resultHistory =
      this.historyPoint < this.histories.length
        ? this.histories.slice(0, this.historyPoint)
        : this.histories;
    resultHistory.forEach((history: number[]) => {
      this._moveByHistory(history[0], history[1]);
    });
  }

  _moveByHistory(employeeID: number, supervisorID: number) {
    this._moveAction(employeeID, supervisorID);
  }

  _moveAction(employeeID: number, supervisorID: number) {
    const employee = this.allStaffs.filter(
      (employee: Employee) => employee.uniqueId === employeeID
    )[0];
    const sourceSupervisor = this._getEmployeeSupervisor(employeeID);
    const sourceOrdinates = this.allStaffs.filter(
      (employee: Employee) => employee.uniqueId === employeeID
    )[0].subordinates;
    const targetSupervisor = this.allStaffs.filter(
      (employee: Employee) => employee.uniqueId === supervisorID
    )[0];

    
    sourceSupervisor.subordinates = sourceSupervisor.subordinates.filter(
      (employee: Employee) => employee.uniqueId !== employeeID
    );
    sourceSupervisor.subordinates =
      sourceSupervisor.subordinates.concat(sourceOrdinates);
    targetSupervisor.subordinates.push(employee);
    employee.subordinates = [];
  }

  _addStaff(name: string) {
    this.maxUniqueId++;
    const staffObject = {
      uniqueId: this.maxUniqueId,
      name,
      subordinates: [] as Employee[],
    };
    this.allStaffs.push(staffObject);
    this.ceo.subordinates.push(staffObject);
  }

  _getEmployeeSupervisor(employeeID: number) {
    return this.allStaffs.filter(
      (employee: Employee) =>
        employee.subordinates.filter(
          (thisEmployee: Employee) => thisEmployee.uniqueId === employeeID
        ).length !== 0
    )[0];
  }

  _reset() {
    this.allStaffs = this.allStaffs.map((employee: Employee) => {
      return {
        ...employee,
        subordinates: [],
      };
    });
    this.allStaffs[0].subordinates = this.allStaffs.slice(
      1,
      this.allStaffs.length
    );
    this.ceo = this.allStaffs[0];
  }
}

export default EmployeeOrgApp