import "./Padding.css";

const Padding = () => {
  return (
    <footer className="footer-container">
      <div className="footer-box">
        <p>
          &copy; {new Date().getFullYear()} Menų Menai. Visos teisės saugomos.
        </p>
      </div>
    </footer>
  );
};

export default Padding;
