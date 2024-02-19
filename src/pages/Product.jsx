import React, { useState } from "react";
function Product({ data }) {
  const products = data?.data?.data.response?.docs;
  const productBrand =
    data?.data?.data.response?.docs?.map((doc) => doc.product_brand[0]) || [];
  const numFound = data?.data?.data?.response?.numFound || 0;
  const recommedations = data?.data?.test;
  const suggestions = data?.data?.relateddata;
  const similarData = data?.data?.similarData?.response?.docs;
  const similarnumFound = data?.data?.similarData?.response?.numFound || 0;
  return (
    <>
      <h3 style={{ float: "left" }}>Search Results</h3>
      <br />
      {numFound != 0 && recommedations == "ok" ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Brand</th>
                <th>Category</th>
                <th>MRP</th>
              </tr>
            </thead>
            {products?.map((i) => {
              return (
                <tbody>
                  <tr>
                    <td>{i.product_name[0]}</td>
                    <td>{i.product_brand[0]}</td>
                    <td>{i.product_category[0]}</td>
                    <td>{i.mrp[0]}</td>
                  </tr>
                </tbody>
              );
            })}
          </table>

          {Array.isArray(suggestions) ? (
            <>
              <h3 style={{ float: "left" }}>Similar Products</h3>
              <br />
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Brand</th>
                    <th>Category</th>
                    <th>MRP</th>
                  </tr>
                </thead>
                {suggestions?.map((i) => {
                  return (
                    <tbody>
                      <tr>
                        <td>{i.product_name[0]}</td>
                        <td>{i.product_brand[0]}</td>
                        <td>{i.product_category[0]}</td>
                        <td>{i.mrp[0]}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
              <br />
              <br />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <h2>No results found</h2>
          {Array.isArray(similarData) && similarnumFound !== 0 ? (
            <>
              <h3 style={{ float: "left" }}>Similar Products</h3>
              <br />
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Brand</th>
                    <th>Category</th>
                    <th>MRP</th>
                  </tr>
                </thead>
                {similarData?.map((i) => {
                  return (
                    <tbody>
                      <tr>
                        <td>{i.product_name[0]}</td>
                        <td>{i.product_brand[0]}</td>
                        <td>{i.product_category[0]}</td>
                        <td>{i.mrp[0]}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
              <br />
              <br />
            </>
          ) : (
            <></>
          )}
        </>
      )}

      {recommedations == "notok" && similarnumFound == 0 ? (
        <>
          <h3 style={{ float: "left" }}>Products you may like</h3>
          <br />
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Brand</th>
                <th>Category</th>
                <th>MRP</th>
              </tr>
            </thead>
            {products?.map((i) => {
              return (
                <tbody>
                  <tr>
                    <td>{i.product_name[0]}</td>
                    <td>{i.product_brand[0]}</td>
                    <td>{i.product_category[0]}</td>
                    <td>{i.mrp[0]}</td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <br />
          <br />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Product;
