import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import "./index.css";
import debounce from "lodash/debounce";

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dep_data: [],
      isLoading: false,
      filterState: {},
      pages: -1
    };
  }

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
        : "deptid",
      search
    };
    this.setState({
      isLoading: true
    });

    const json = await axios.get(
      "https://genericspringrest.herokuapp.com/department",
      { params }
    );

    const newData = json.data.content.map(result => ({
      deptid: result.deptid,
      deptname: result.deptname
      //  depthead: result.depthead
    }));

    this.setState({
      ...this.state,
      dep_data: newData,
      isLoading: false,
      pages: json.data.totalPages
    });
  }, 500);

  handleChange = (onChange, identifier) => {
    return e => {
      this.setState({
        filterState: {
          ...this.state.filterState,
          [identifier]: e.target.value
        }
      });
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

  render() {
    const { dep_data, isLoading, pages } = this.state;
    return (
      <div>
        <ReactTable
          data={dep_data}
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
              Header: "Deptid",
              accessor: "deptid",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "deptid")}
                  value={
                    this.state.filterState.deptid
                      ? this.state.filterState.deptid
                      : ""
                  }
                />
              )
            },
            {
              Header: "Department",
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
              Header: "DeptHead",
              accessor: "depthead",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  value={
                    this.state.filterState.depthead
                      ? this.state.filterState.depthead
                      : ""
                  }
                  onChange={this.handleChange(onChange, "depthead")}
                />
              )
            }
          ]}
          defaultSorted={[
            {
              id: "Deptid",
              desc: true
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
export default Department;