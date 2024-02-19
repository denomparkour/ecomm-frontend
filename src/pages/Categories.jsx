import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Product from "./Product";
function Categories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:8080/categories";
  const [searchDiv, setSearchDiv] = useState("none");
  const [searchInput, setSearchInput] = useState("");
  const [response, setResponse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  var totalPages;
  var currentItems;
  useEffect(() => {
    axios.post(url).then((response) => {
      setData(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };
   totalPages = Math.ceil(data.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   currentItems = data.slice(startIndex, endIndex);
  useEffect(() => {
    if (searchInput == "") {
      setSearchDiv("none");
    } else {
      setSearchDiv("block");
      const url = "http://localhost:8080/solr";
      axios
        .post(url, {
          query: searchInput,
        })
        .then((response) => {
          setResponse(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [searchInput])
  return loading ? (
    <>Fetching data...</>
  ) : (
    <>
      <button className="link_btn">
        <Link to={"/products/page=1"}>Show all</Link>
      </button>
      <input
        style={{
          padding: "0.6em 1.2em",
          marginLeft: "10px",
          fontSize: "1em",
          borderRadius: "10px",
          outline: "none",
          border: "none",
          backgroundColor: "#19181d",
          borderColor: "#2E2E36",
          borderStyle: "solid",
          borderWidth: "1px",
        }}
        onInput={(e) => setSearchInput(e.target.value)}
        placeholder="search"
      />
      <br />
      <br />
      <div
        style={{
          display: searchDiv,
        }}
      >
        {<Product data={response} />}
      </div>
      <h3 style={{ float: "left" }}>Categories</h3>
      <br/>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Categories</th>
            <th>Stock</th>
            <th>Created Date</th>
          </tr>
        </thead>
        {currentItems.map((i) => {
          return (
            <tbody key={i.cat_id}>
              <tr>
                <td>{i.cat_id}</td>
                <td className="link_btn">
                  <Link to={`/products/category=${i.cat_id}/page=1`}>{i.cat_name}</Link>
                </td>
                <td>{i.stock}</td>
                <td>{formatDate(i.created_date)}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
       <div
        style={{
          height: "50px",
          marginTop: "50px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          bottom: "0",
        }}
      >
      <button
          disabled={currentPage == 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          {"< Previous"}
        </button>
        <span style={{ margin: "10px" }}>
          {" "}
          {/* Page {currentPage}/{totalPages} */}
          <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <li
                key={pageNumber + 1}
                onClick={() => setCurrentPage(pageNumber + 1)}
                style={{
                  margin: "0 5px",
                  cursor: "pointer",
                  color: pageNumber + 1 === currentPage ? "white" : "#26252B",
                }}
              >
                {pageNumber + 1}
              </li>
            ))}
          </ul>
        </span>{" "}
        <button
          disabled={currentPage == totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >{"Next >"}</button>
        </div>
    </>
  );
}

export default Categories;
