import React from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const Products = () => {
  const url = "http://localhost:8080/products";
  const [data, setData] = useState([]);
  const params = useParams();
  const [hasPar, setHasPar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [id, setId] = useState(1);
  const [selectedOption, setSelectedOption] = useState(0);
  const [categories, setCategories] = useState([]);
  const [nowPage, setNowPage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  var currentItems;
  var count = 0;
  var totalPages = 0;
  useEffect(() => {
    const int =   
    setCurrentPage(int);
    axios.post("http://localhost:8080/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);


  useEffect(() => {
    const handleBack = () => {
      // Refresh and navigate back
      window.location.reload();
      navigate(location.pathname, { replace: false }); 
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOption]);
  if (Object.keys(params).length === 0) {
    useEffect(() => {
      setHasPar(true);
      if (selectedOption == 0) {
        axios.post(`${url}`).then((response) => {
          setData(response.data);
          // setHasPar(true);
        });
      } else {
        axios.post(`${url}/${selectedOption}`).then((response) => {
          setData(response.data);
        });
      }
    }, [currentPage, selectedOption]);
    totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentItems = data.slice(startIndex, endIndex);
  } else {
    if (params.id.startsWith("page")) {
      var int = "";
      try {
        int = +params.id.match(/\d+/)[0];
      } catch (err) {
        navigate("/nothing");
      }
      totalPages = Math.ceil(data.length / itemsPerPage);
      useEffect(() => {
        if (selectedOption == 0) {
          axios.post(`${url}`).then((response) => {
            setData(response.data);
            // setHasPar(true);
            num = +params.id.match(/\d+/);
            setNowPage(num);
          });
        } else {
          axios.post(`${url}/${selectedOption}`).then((response) => {
            setData(response.data);
          });
        }
      }, [selectedOption]);
      useEffect(() => {
        axios.post(`${url}`).then((response) => {
          setHasPar(true);
          setData(response.data);
          if (params.id.includes("category")) {
            num = +params.id.match(/\d+/);
            setNowPage(num);
          }
          setCurrentPage(int);
        });
      }, []);

      totalPages = Math.ceil(data.length / itemsPerPage);

      if (nowPage > totalPages) {
        navigate("/nothing");
      }
    } else if (!params.id.includes("page") && !params.page) {
      useEffect(() => {
        axios.post(`${url}/${params.id}`).then((response) => {
          setData(response.data);
          setCurrentPage(1);
        });
      }, []);
    } else if (params.id && params.page) {
      var num;
      if (params.id.includes("category")) {
        num = +params.id.match(/\d+/);
        useEffect(() => {
          if (categories.length != 0) {
            if (num > categories.length || num === 0) {
              navigate("/nothing");
            }
          }
        }, [categories]);
      } else {
        num = +params.page.match(/\d+/);
      }
      var int = +params.page.match(/\d+/);
      useEffect(() => {
        setNowPage(int);
        axios.post(`${url}/${num}`).then((response) => {
          setData(response.data);
          setCurrentPage(int);
        });
      }, []);
    }

    totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentItems = data.slice(startIndex, endIndex);
  }
  useEffect(() => {
    if (params.id?.includes("page")) {
      var new_url =
        "/products" +
        // (params.id ? "/category=" + +params.id.match(/\d+/)[0] : "") +
        "/page=" +
        +currentPage;
      window.history.pushState(null, "", new_url);
    } else {
      var new_url =
        "/products" +
        (params.id ? "/category=" + +params.id.match(/\d+/)[0] : "") +
        "/page=" +
        +currentPage;
      window.history.pushState(null, "", new_url);
    }
  }, [currentPage]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  useEffect(() => {
    if (nowPage > totalPages || nowPage === 0) {
      navigate("/nothing");
    }
  }, [totalPages]);

  return !hasPar ? (
    <>
      <button style={{ marginBottom: "10px" }} className="link_btn">
        <Link to={"/categories"}>{"< Home"}</Link>
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>MRP</th>
            <th>Discounted Price</th>
            <th>Added on</th>
          </tr>
        </thead>
        {currentItems.map((i) => {
          return (
            <tbody key={i.product_id}>
              <tr>
                <td>{data.indexOf(i) + 1}</td>
                <td>{i.product_name}</td>
                <td>{i.product_brand}</td>
                <td>{i.product_category}</td>
                <td>{i.mrp}rs</td>
                <td>{i.discounted_price}rs</td>
                <td>{formatDate(i.created_on)}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
      <div
        style={{
          height: "50px",
          marginTop: "8px",
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
        >
          {"Next >"}
        </button>
      </div>
    </>
  ) : (
    <div style={{ position: "relative" }}>
      <div>
        <button className="link_btn" style={{ marginRight: "10px" }}>
          <Link to={"/Categories"}>{"< Home"}</Link>
        </button>
        <span> </span>
        <select
          style={{
            padding: "10px",
            backgroundColor: "#19181d",
            borderRadius: "10px",
            borderColor: "#2E2E36",
            fontSize: "1em",
            fontWeight: 500,
            fontFamily: "inherit",
          }}
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value={0}>Show all</option>
          {categories.map((i) => {
            return (
              <option key={i.cat_id} value={i.cat_id}>
                {i.cat_name}
              </option>
            );
          })}
        </select>
      </div>
      <br />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>MRP</th>
            <th>Discounted Price</th>
            <th>Added on</th>
          </tr>
        </thead>
        {currentItems.map((i) => {
          return (
            <tbody key={i.product_name}>
              <tr>
                <td>{data.indexOf(i) + 1}</td>
                <td>{i.product_name}</td>
                <td>{i.product_brand}</td>
                <td>{i.product_category}</td>
                <td>{i.mrp}rs</td>
                <td>{i.discounted_price}rs</td>
                <td>{formatDate(i.created_on)}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
      <br />
      <div
        style={{
          height: "50px",
          marginTop: "8px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          bottom: "0",
        }}
      >
        <button
          disabled={currentPage == 1}
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          {"< Previous"}
        </button>
        <span style={{ margin: "10px" }}>
          {" "}
          {/* Page {currentPage}/{totalPages}  */}
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
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          {"Next >"}
        </button>
      </div>
    </div>
  );
};

export default OLdProducts;
// totalPages = Math.ceil(products.length / itemsPerPage);
// const startIndex = (currentPage - 1) * itemsPerPage;
// const endIndex = startIndex + itemsPerPage;
// currentItems = products.slice(startIndex, endIndex);
//   var totalPages;
//   var currentItems;