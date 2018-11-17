import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      emp_data: [],
      isLoading: false,
      startDate: moment()
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {

      axios.get("https://spring-employee.herokuapp.com/employees")
        .then(json => json.data._embedded.employees.map(result => (
          {

            Name: result.empname,
            Skill: result.skill,
            Salary: result.salary,
            Grade: result.grade,
            City: result.city,
            Country: result.country,
            DOJ: result.doj,
            Designation: result.designation
          })))
        .then(newData => this.setState({ emp_data: newData, isLoading: false }))
        .catch(function (error) {
          console.log(error);
        });

    });

    this.date_picker = this.date_picker.bind(this);
    this.Dropdown = this.Dropdown.bind(this);
  }



  Dropdown(cellInfo) {
    const options = ["Manager", "Executive", "Developer"];
    const data = [...this.state.emp_data];

    return (
      <Dropdown
        contentEditable
        onChange={e => {
          const data = [...this.state.emp_data];
          data[cellInfo.index][cellInfo.column.id] = e.value;
          this.setState({ emp_data: data });
        }}
        options={options}
        value={data[cellInfo.index][cellInfo.column.id]}
        placeholder="Select"
      />
    );
  }


  date_picker(cellInfo) {
    console.log();
    return (
      <DatePicker
        contentEditable
        selected={moment(
          this.state.emp_data[cellInfo.index][cellInfo.column.id],
          "YYYY-MM-DD"
        )}
        onChange={e => {
          const data = [...this.state.emp_data];
          data[cellInfo.index][cellInfo.column.id] = e;
          this.setState({ emp_data: data });
          console.log(data);
        }}

      />
    );
  }

  render() {
    let content;
    const { emp_data, isLoading } = this.state;
    if (isLoading) {
      content = <div>Loading...</div>;
    }
    else {
      content = <div>
        <ReactTable
          data={emp_data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          columns={[
            {
              Header: "Name",
              accessor: "Name",
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
            },

            {
              Header: "Skill",
              accessor: "Skill",
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
            },
            {
              Header: "DOJ",
              accessor: "DOJ",
              Cell: this.date_picker,
              minWidth: 150,
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
            },
            {
              Header: "Designation",
              accessor: "Designation",
              Cell: this.Dropdown,
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
            },
            {
              Header: "Grade",
              accessor: "Grade",
              filterMethod: (filter, row) =>
                String(row[filter.id]).startsWith(filter.value)
            },
            {
              Header: "Salary",
              accessor: "Salary",
              filterMethod: (filter, row) =>
                String(row[filter.id]).startsWith(filter.value)
            },
            {
              Header: "City",
              accessor: "City",
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
            },
            {
              Header: "Country",
              accessor: "Country",

              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
            }
          ]}
          defaultSorted={[
            {
              id: "Name",
              desc: true
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
        />
      </div >

    }
    return (
      <div>
        {content}
      </div >
    )
  }
}
export default App;