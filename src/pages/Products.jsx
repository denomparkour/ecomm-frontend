import React from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Product from "./Product";

function Products() {
  const url = "http://localhost:8080";
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryid, setcategoryid] = useState(0);
  const [catlen, setcatlen] = useState(10);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchDiv, setSearchDiv] = useState("none");
  const [searchInput, setSearchInput] = useState("");
  const [response, setResponse] = useState([]);
  const visiblePageCount = 3;

  const params = useParams();
  const navigate = useNavigate();
  var totalPages;
  var currentItems;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };
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
  }, [searchInput]);
  useEffect(() => {
    axios.post(`${url}/categories`).then((response) => {
      setCategories(response.data);
      setcatlen(response.data.length);
    });

    if (Object.keys(params).length === 0) {
      axios.post(`${url}/products`).then((response) => {
        setProducts(response.data);
        setSelectedOption(+categoryid);
        setLoading(false);
      });
    }

    if (params.category && params.page) {
      const cat_id = params.category?.match(/\d+/)[0];
      setcategoryid(cat_id);
      const currPage = +params.page?.match(/\d+/)[0];
      axios.post(`${url}/products/${categoryid}`).then((res) => {
        setProducts(res.data);
        setLoading(false);
        setCurrentPage(currPage);
      });
      setSelectedOption(cat_id);
    }

    if (params.page) {
      try {
        const currPage = +params.page?.match(/\d+/)[0];
        axios.post(`${url}/products/${categoryid}`).then((res) => {
          setProducts(res.data);
          setLoading(false);
          setCurrentPage(currPage);
        });
      } catch (err) {
        console.log(err);
        navigate("/404");
      }
    }
  }, [categoryid]);

  useEffect(() => {
    if (selectedOption == 0) {
      axios.post(`${url}/products`).then((response) => {
        setProducts(response.data);
        // navigate(`/products/page=${currentPage}`);
        window.history.replaceState(
          null,
          "Ecommerce",
          `/products/page=${currentPage}`
        );
        setLoading(false);
      });
    } else {
      axios.post(`${url}/products/${selectedOption}`).then((response) => {
        setProducts(response.data);
        // navigate(`/products/category=${selectedOption}/page=${currentPage}`);
        window.history.replaceState(
          null,
          "Ecommerce",
          `/products/category=${selectedOption}/page=${currentPage}`
        );
        setLoading(false);
      });
    }
  }, [selectedOption, categoryid, currentPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOption]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      console.log(currentPage, totalPages);
      navigate("/404");
    }
    if (categoryid > catlen) {
      navigate("/404");
    }
  }, [currentPage, totalPages, selectedOption, categories]);
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    let visiblePages = [];
    if (totalPages <= visiblePageCount) {
      visiblePages = pages;
    } else {
      const halfVisibleCount = Math.floor(visiblePageCount / 2);
      const leftVisible = Math.min(currentPage - 1, halfVisibleCount);
      const rightVisible = Math.min(totalPages - currentPage, halfVisibleCount);
      const firstVisible = currentPage - leftVisible;
      const lastVisible = currentPage + rightVisible;

      visiblePages = pages.slice(firstVisible - 1, lastVisible);
    }

    return visiblePages.map((pageNumber) => (
      <li
        key={pageNumber}
        onClick={() => setCurrentPage(pageNumber)}
        style={{
          margin: "0 5px",
          cursor: "pointer",
          color: pageNumber === currentPage ? "white" : "#26252B",
        }}
      >
        {pageNumber}
      </li>
    ));
  };

  totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  currentItems = products.slice(startIndex, endIndex);
  return !loading ? (
    <>
      <div style={{ position: "relative" }}>
        <div>
          <button className="link_btn" style={{ marginRight: "10px" }}>
            <Link to={"/categories"}>{"< Home"}</Link>
          </button>
          <span> </span>
          <input
            style={{
              padding: "0.6em 1.2em",
              marginRight: "10px",
              marginBottom: "1px",
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
        <div
          style={{
            display: searchDiv,
          }}
        >
          {<Product data={response} />}
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
              <tbody>
                <tr>
                  <td>{products.indexOf(i) + 1}</td>
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
          <span style={{ margin: "10px", overflow: "hidden" }}>
            {" "}
            <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
              {currentPage > Math.floor(visiblePageCount / 2) + 1 && (
                <>
                  <li
                    onClick={() => setCurrentPage(1)}
                    style={{ margin: "0 5px", cursor: "pointer" }}
                  >
                    1
                  </li>
                  <li style={{ margin: "0 5px" }}>...</li>
                </>
              )}
              {renderPageNumbers()}
              {currentPage < totalPages - Math.floor(visiblePageCount / 2) && (
                <>
                  <li style={{ margin: "0 5px" }}>...</li>
                  <li
                    onClick={() => setCurrentPage(totalPages)}
                    style={{ margin: "0 5px", cursor: "pointer" }}
                  >
                    {totalPages}
                  </li>
                </>
              )}
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
    </>
  ) : (
    <>Loading data...</>
  );
}

export default Products;
