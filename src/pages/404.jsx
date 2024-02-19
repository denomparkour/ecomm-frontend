
import React from "react";
import { Link } from "react-router-dom";
import giphy from '../assets/giphy.gif'

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <img style={styles.image} src={giphy} alt="Lost in Space" />
      <h1 style={styles.heading}>404</h1>
      <p style={styles.message}>
        Oops! Something went wrong. The page you're looking for might be in
        another galaxy.
      </p>
      <button className="link_btn">
        <Link
          style={styles.button}
          to="/categories"
        >
          Go Home{" "}
        </Link>
      </button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#19181d",
    textAlign: "center",
    padding: "20px",
    maxWidth: "400px",
    margin: "auto",
  },
  heading: {
    color: "#fff",
    fontSize: "3em",
    margin: "10px 0",
  },
  message: {
    color: "#fff",
    fontSize: "1em",
  },
  image: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "10px",
  },

  button: {
    backgroundColor: "#19181D",
    margin: "10px",
    color: "white",
    padding: "10px 20px",
    fontSize: "1em",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
  } 
};

export default NotFoundPage;
