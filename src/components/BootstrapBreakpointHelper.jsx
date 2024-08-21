export default function BootstrapBreakpointHelper() {
    return (
        <div
            style={{
                position: "fixed",
                top: "90%",
                left: "50%",
                zIndex: "10000",
                transform: "translate(-50%, -50%)",
                background: "rgba(247, 201, 241, 0.4)",
                padding: ".5rem 1rem",
                borderRadius: "30px",
            }}
        >
            <div className="d-block d-sm-none">Extra Small (xs)</div>
            <div className="d-none d-sm-block d-md-none">Small (sm)</div>
            <div className="d-none d-md-block d-lg-none">Medium (md)</div>
            <div className="d-none d-lg-block d-xl-none">Large (lg)</div>
            <div className="d-none d-xl-block d-xxl-none">X-Large (xl)</div>
            <div className="d-none d-xxl-block">XX-Large (xxl)</div>
        </div>
    );
}
