export default function Loader({ label = "Loading" }) {
  return <div className="loader-screen" role="status"><span className="spinner" />{label}</div>;
}