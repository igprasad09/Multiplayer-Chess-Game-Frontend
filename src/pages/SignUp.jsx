import PawnLoader from "../components/PawnLoader";

function SignUp(){
    return (
    <div className="bg-stone-800 h-screen p-5">

           <img className="h-12 m-auto mt-6" src="/public/images/chesslogo.png" alt="" />
           <p className="text-white text-center mt-5 font-sans text-4xl font-bold">Create Your Chess.com</p>
           <p className="text-white text-center  font-sans text-4xl font-bold">Account</p>
           <div className="mt-10">
               <PawnLoader />
           </div>
    </div>)
}

export default SignUp;
