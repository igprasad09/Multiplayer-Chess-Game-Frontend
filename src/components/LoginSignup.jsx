import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSetAtom } from "jotai";
import { reLoginAtom, userNameAtom } from "../utils/store/ChessAtom";

const REMEMBER_KEY = "chess_remember_me";
const USERNAME_KEY = "chess_remembered_username";

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12Zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9Z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M6 10V8a6 6 0 1 1 12 0v2h.5A1.5 1.5 0 0 1 20 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H6Zm2 0h8V8a4 4 0 1 0-8 0v2Z" clipRule="evenodd" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M12 5c-6.1 0-10.1 3.6-12 7 1.9 3.4 5.9 7 12 7s10.1-3.6 12-7c-1.9-3.4-5.9-7-12-7Zm0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M3.5 4.9 19.1 20.5l1.4-1.4-2.8-2.8c2-1.5 3.5-3.4 4.3-4.8-1.9-3.4-5.9-7-12-7-1.6 0-3 .3-4.3.8L4.9 3.5 3.5 4.9Zm8.5 2.1c1 0 1.9.2 2.8.5l-1.6 1.6a3 3 0 0 0-3.8 3.8l-2.2 2.2c-.9-1-1.4-2.3-1.4-3.6a6 6 0 0 1 6.2-6ZM4.5 7.3 6 8.8C4.7 9.8 3.6 11 2.8 12c1.9 3.4 5.9 7 9.2 7 1 0 2-.2 2.8-.5l1.6 1.6c-1.4.5-2.9.8-4.4.8-6.1 0-10.1-3.6-12-7 .9-1.6 2.5-3.7 4.5-5.2Z" />
    </svg>
);

const INPUT_CLASSES =
    "bg-stone-700 transition duration-300 ease-in-out h-10 w-full text-white border border-zinc-600 placeholder:text-zinc-300 rounded-sm focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500";

function LoginSignup(){
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const location = useLocation();
    const [loginSignup, setLoginSignup] = useState("login");
    const navigate = useNavigate();
    const setRelogin = useSetAtom(reLoginAtom);
    const setUsernameinatom = useSetAtom(userNameAtom);

    useEffect(()=>{
         const res = location.pathname == "/login" ? "login" : "signup";
         setLoginSignup(res);
         console.log("locaiton: ",location.pathname)
    },[location])
    
    async function handleAuth(){
        if(!username || !password){return toast.error("Enter Username and Password")}

        const url = loginSignup == "login"
            ? "http://localhost:3000/auth/login"
            : "http://localhost:3000/auth/signup";

        async function authRequest(){
            const res = await axios.post(url, {username, password}, {withCredentials: true});
            if(!res.data.success){
                throw new Error(res.data.message || "Something went wrong");
            }
            setUsernameinatom(res.data.username);
            setRelogin(false);
            navigate("/home");
            return res.data;
        }

        function getErrorMessage(err){
            const data = err.response?.data;
            if(data?.message) return data.message;
            if(data?.errors?.length) return data.errors[0].message;
            return err.message || "Something went wrong";
        }

        try{
            await toast.promise(authRequest(), {
                loading: loginSignup == "login" ? "Logging in..." : "Creating account...",
                success: (data) => data.message,
                error: getErrorMessage,
            });
        }catch(err){
            console.log(err);
        }
    }

    // Load whatever was remembered last time this page mounts.
    useEffect(() => {
        const remembered = localStorage.getItem(REMEMBER_KEY) !== "false";
        setRememberMe(remembered);
        if (remembered) {
            setUsername(localStorage.getItem(USERNAME_KEY) || "");
        }
    }, []);

    const handleRememberMeChange = (e) => {
        const checked = e.target.checked;
        setRememberMe(checked);
        localStorage.setItem(REMEMBER_KEY, checked);
        if (!checked) {
            localStorage.removeItem(USERNAME_KEY);
        }
    };

    return(
        <div className="bg-zinc-900 transition duration-300 ease-in-out rounded-md mt-9 grid p-5 content-start w-100 gap-2">
                   <Toaster position="top-right" />
                    <div className="relative m-2">
                        <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                            <UserIcon />
                        </span>
                        <input
                            className={`${INPUT_CLASSES} pl-10 pr-3`}
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e)=>setUsername(e.target.value.trim())}
                        />
                    </div>

                    <div className="relative m-2">
                        <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                            <LockIcon />
                        </span>
                        <input
                            className={`${INPUT_CLASSES} pl-10 pr-10`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e)=> setPassword(e.target.value.trim())}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-200"
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between m-2 text-sm">
                        <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                className="h-4 w-4 accent-green-600 cursor-pointer"
                            />
                            Remember me
                        </label>
                        <p onClick={ ()=>{ 
                                        if(location.pathname == "/login"){ return navigate("/signup") }
                                        if(location.pathname == "/signup") {return navigate("/login")}
                                   } } className="text-zinc-300 cursor-pointer underline hover:text-white">
                            {loginSignup == "login" ? "Create New Account" : "Account Already Created"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAuth}
                        className={`m-2 transition-colors duration-300 ease-in-out h-12 cursor-pointer rounded-sm ${!username || !password ? "bg-[#bff0b3] text-[#41553c]" : "bg-[#45a52e] text-white"} hover:bg-[#3faa24] font-bold text-lg`}
                    >
                         {loginSignup == "login" ? "Account Already Created" : "Create New Account"}
                    </button>
                </div>
    )
}

export default LoginSignup;