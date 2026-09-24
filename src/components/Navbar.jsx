import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      zIndex: 9999
    }}>

      <h2 style={{color:"#ff7a18"}}>FoodFinder</h2>

      <div style={{display:"flex",gap:"25px"}}>
        <Link to="/" style={{color:"white"}}>Home</Link>
        <Link to="/shops" style={{color:"white"}}>Shops</Link>
        <Link to="/dashboard" style={{color:"white"}}>Dashboard</Link>
        <Link to="/login" style={{color:"white"}}>Login</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/budget">Budget</Link>
      </div>

    </nav>
  )
}

export default Navbar