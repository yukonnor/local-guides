export default function SessionDisplayHelper({ session }) {
    return (
        <>
            <pre>{session ? JSON.stringify(session, null, 2) : "No session data available"}</pre>
        </>
    );
}
