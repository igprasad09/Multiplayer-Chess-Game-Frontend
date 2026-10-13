import PawnLoader from "../components/PawnLoader";
import LoginSignup from "../components/LoginSignup";

function SignupLogin() {
    
    return (
        <div className="bg-stone-800 h-screen p-5 grid content-start justify-center">
            <img className="h-12 m-auto mt-6" src="/images/chesslogo.png" alt="Chess.com logo" />
            <p className="text-white text-center mt-5 font-sans text-4xl font-bold">Create Your Chess.com</p>
            <p className="text-white text-center font-sans text-4xl font-bold">Account</p>

            <div className="mt-10">
                <PawnLoader />
                <LoginSignup />
            </div>
        </div>
    );
}

export default SignupLogin;
