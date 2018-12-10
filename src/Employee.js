import React from "react";
import "./index.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import debounce from "lodash/debounce";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_data: [],
      dep_data: {},
      isLoading: false,
      filterState: {},
      pages: -1
    };
  }

  handleChange = (onChange, identifier) => {
    return event => {
      if (identifier === "doj") {
        this.setState({
          filterState: {
            ...this.state.filterState,
            [identifier]: moment(event._d).format("YYYY-MM-DD")
          }
        });
      } else {
        this.setState({
          filterState: {
            ...this.state.filterState,
            [identifier]: event.target.value
          }
        });
      }
      onChange();
    };
  };

  getFilterValueFromState = (identifier, defaultValue = "") => {
    const filterState = this.state.filterState;
    if (!filterState) {
      return defaultValue;
    }
    if (
      typeof filterState[identifier] !== "undefined" ||
      filterState[identifier] !== null
    ) {
      return filterState[identifier];
    }
    return defaultValue;
  };

  fetchDepartmentDetails = async deptId => {
    if (!this.state.dep_data[deptId]) {
      const json = await axios.get(deptId);

      const deptData = json.data;
      this.setState({
        dep_data: { ...this.state.dep_data, [deptId]: deptData }
      });
    }
  };

  fetchGridData = debounce(async (state, instance) => {
    let search = null;

    const filterKeys = Object.keys(this.state.filterState);
    if (filterKeys.length !== 0) {
      search = "( ";
      search += filterKeys
        .map(key => {
          return this.state.filterState[key]
            ? key + ":" + this.state.filterState[key]
            : "";
        })
        .join(" and ");
      search += " )";
    }

    const params = {
      page: state.page,
      size: state.pageSize,
      sort: state.sorted["0"]
        ? state.sorted["0"].id +
        "," +
        (state.sorted["0"].desc === false ? "desc" : "asc")
        : "id",
      search
    };

    this.setState({
      isLoading: true
    });

    const json = await axios.get(
      "https://genericspringrest.herokuapp.com/employee",
      { params }
    );

    const newData = json.data.content.map(result => ({
      id: result.id,
      name: result.name,
      skill: result.skill,
      salary: result.salary,
      grade: result.grade,
      city: result.city,
      country: result.country,
      doj: result.doj,
      desg: result.desg,
      deptname: result.deptid.deptname,
      Dep_head: result.deptid
    }));

    this.setState({
      ...this.state,
      emp_data: newData,
      isLoading: false,
      pages: json.data.totalPages
    });
  }, 500);

  render() {
    const { emp_data, isLoading, pages } = this.state;
    const content = (
      <div>
        <ReactTable
          data={emp_data}
          freezeWhenExpanded={true}
          filterable
          pages={pages}
          showPagination={true}
          showPaginationTop={true}
          showPaginationBottom={true}
          manual
          minRows={0}
          loading={isLoading}
          onFetchData={this.fetchGridData}
          columns={[
            {
              Header: "ID",
              accessor: "id",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "id")}
                  value={
                    this.state.filterState.id ? this.state.filterState.id : ""
                  }
                />
              )
            },
            {
              Header: "Name",
              accessor: "name",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "name")}
                  value={
                    this.state.filterState.name
                      ? this.state.filterState.name
                      : ""
                  }
                />
              )
            },

            {
              Header: "Skill",
              accessor: "skill",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "skill")}
                  value={
                    this.state.filterState.skill
                      ? this.state.filterState.skill
                      : ""
                  }
                />
              )
            },
            {
              Header: "DOJ",
              accessor: "doj",
              Filter: ({ filter, onChange }) => (
                <DatePicker
                  placeholderText="Select a date"
                  value={
                    this.state.filterState.doj ? this.state.filterState.doj : ""
                  }
                  onChange={this.handleChange(onChange, "doj")}
                />
              )
            },
            {
              Header: "Designation",
              accessor: "desg",
              minWidth: 110,
              Filter: ({ filter, onChange }) => (
                <select
                  onChange={this.handleChange(onChange, "desg")}
                  value={this.getFilterValueFromState("desg", "all")}
                  style={{
                    width: "100%"
                  }}
                >
                  <option value="all"> Show all </option>
                  <option value="dev">dev</option>
                  <option value="Tester"> Tester </option>
                  <option value="Specialist"> Specialist </option>
                </select>
              )
            },
            {
              Header: "DeptName",
              accessor: "deptname",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "deptname")}
                  value={
                    this.state.filterState.deptname
                      ? this.state.filterState.deptname
                      : ""
                  }
                />
              )
            },
            {
              Header: "Grade",
              accessor: "grade",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "grade")}
                  value={
                    this.state.filterState.grade
                      ? this.state.filterState.grade
                      : ""
                  }
                />
              )
            },
            // {
            //   Header: "Department",
            //   accessor: "deptname",
            //   Filter: ({ filter, onChange }) => (
            //     <input
            //       type="text"
            //       size="8"
            //       onChange={this.handleChange(onChange, "deptname")}
            //       value={
            //         this.state.filterState.deptname
            //           ? this.state.filterState.deptname
            //           : ""
            //       }
            //     />
            //   )
            // },
            {
              Header: "Salary",
              accessor: "salary",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "salary")}
                  value={
                    this.state.filterState.salary
                      ? this.state.filterState.salary
                      : ""
                  }
                />
              )
            },
            {
              Header: "City",
              accessor: "city",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "city")}
                  value={
                    this.state.filterState.city
                      ? this.state.filterState.city
                      : ""
                  }
                />
              )
            },
            {
              Header: "Country",
              accessor: "country",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "country")}
                  value={
                    this.state.filterState.country
                      ? this.state.filterState.country
                      : ""
                  }
                />
              )
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          getTdProps={() => {
            return {
              style: {
                overflow: "visible"
              }
            };
          }}
          getTheadFilterThProps={() => {
            return {
              style: {
                position: "inherit",
                overflow: "inherit"
              }
            };
          }}
          SubComponent={rows => {
            const dep = rows.original.Dep_head.depthead;
            return (
              <div className="Posts">
                <header>
                  <ul>
                    <li>Dep ID : {rows.original.Dep_head.deptid}</li>
                    <li>Dep Name : {rows.original.Dep_head.deptname}</li>
                    <li>Dep Head : {dep.name}</li>
                    <li>City : {dep.city}</li>
                    <li>Country : {dep.country}</li>
                    <li>Designation : {dep.designation}</li>
                    <li>DOJ : {dep.doj}</li>
                    <li>Grade : {dep.grade}</li>
                    <li>Salary : {dep.salary}</li>
                    <li>Skill : {dep.skill}</li>
                  </ul>
                </header>
              </div>
            );
          }}
        />
      </div>
    );

    return <div> {content} </div>;
  }
}

export default Employee;