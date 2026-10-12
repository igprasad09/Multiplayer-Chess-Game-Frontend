import { useEffect } from "react";
import playSound from "../hooks/playSound";

const ORBIT_DOTS = [0, 120, 240];
const SPARKS = [0, 60, 120, 180, 240, 300];

function PawnLoader(){

    useEffect(() => {
        playSound("chessload");
        return () => playSound("chessload", true);
    }, []);

    return (
    <div className="loader-enter relative w-40 h-40 mx-auto [perspective:700px]">

        <div className="pawn-glow absolute left-1/2 bottom-6 h-28 w-28 rounded-full bg-[#81B64C] blur-2xl"></div>

        <div className="absolute left-1/2 bottom-10 h-24 w-24 -translate-x-1/2 translate-y-1/2">
            <div className="board-plate absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-[3px] shadow-[0_18px_30px_rgba(0,0,0,0.55)]">
                <div className="bg-[#4a4745]"></div>
                <div className="bg-[#2e2c2b]"></div>
                <div className="bg-[#2e2c2b]"></div>
                <div className="bg-[#4a4745]"></div>
            </div>
        </div>

        <div className="absolute left-1/2 bottom-10 translate-y-1/2">
            <div className="ripple absolute left-0 top-0 h-16 w-16"></div>
            <div className="pawn-shadow absolute left-0 top-0 h-4 w-14 rounded-full bg-black/70 blur-[4px]"></div>
        </div>

        <div className="absolute left-1/2 bottom-10 h-[72px] w-[72px] -translate-x-1/2">
            <div className="orbit absolute inset-0">
                {ORBIT_DOTS.map((deg, i) => (
                    <span
                        key={deg}
                        className="orbit-dot absolute left-1/2 top-1/2 h-2.5 w-2.5 -ml-[5px] -mt-[5px] rounded-[2px] bg-[#81B64C] shadow-[0_0_10px_#81B64C]"
                        style={{
                            transform: `rotate(${deg}deg) translateY(-70px) rotate(45deg)`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}
            </div>
        </div>

        <div className="absolute left-1/2 bottom-10">
            {SPARKS.map((deg) => (
                <span
                    key={deg}
                    className="spark absolute z-20 h-2 w-2 rounded-full bg-[#B2E068] shadow-[0_0_8px_#B2E068]"
                    style={{ "--a": `${deg}deg` }}
                />
            ))}
        </div>

        <svg
            className="pawn-piece absolute left-1/2 bottom-10 z-10 h-[72px] w-[49.5px] drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]"
            viewBox="0 0 22 32"
            fill="none"
        >
            <path d="M18.7635 23.0905C13.3587 18.9895 13.9594 15.4295 13.8917 13.9663H17.1875C17.5725 13.2547 17.7692 12.5937 17.7692 11.7726L14.0335 9.3242C15.3323 8.38735 16.1785 6.86946 16.1785 5.15157C16.1785 2.98946 14.8394 1.13893 12.9419 0.374723C12.3433 0.132618 8.1104 13.9663 8.1104 13.9663C8.09559 14.2842 8.09136 14.6989 8.09136 15.1979C8.09136 16.5726 11.4844 16.3642 11.3046 17.5768C11.0339 19.3916 10.9767 20.7705 9.40713 25.1326C8.34732 28.0758 1.27982 25.1326 0.774246 26.5768C0.423092 27.5831 0.236938 28.7095 0.236938 29.9221C0.236938 30.0526 0.5204 32 11.0021 32C21.4839 32 21.7673 30.0526 21.7673 29.9221C21.7673 26.9642 20.6567 24.5242 18.7656 23.0905H18.7635Z" fill="#5D9948"/>
            <path d="M10.8097 24.9305C11.3935 22.2926 11.9097 19.48 12.2227 17.7937C12.6141 15.6905 9.40928 15.3158 8.09139 15.1221C8.03216 16.9179 7.5287 19.8316 3.23447 23.0884C2.07736 23.9663 1.21428 25.221 0.717163 26.741C1.87639 27.3032 3.42274 27.6379 5.80678 27.6379C7.3362 27.6379 10.1687 27.821 10.8075 24.9284L10.8097 24.9305Z" fill="#81B64C"/>
            <path d="M13.0604 13.9663C13.5681 12.6547 13.5025 11.7726 13.5025 11.7726L11.3871 9.32421C13.6379 8.36842 14.9918 6.57053 14.9918 4.48C14.9918 2.80842 14.1921 1.32421 12.9525 0.383158C12.3496 0.138948 11.6896 0.00210571 11 0.00210571C8.14214 0.00210571 5.82368 2.30737 5.82368 5.15368C5.82368 6.87158 6.66983 8.38947 7.96868 9.32632L4.23291 11.7747C4.23291 12.5958 4.42753 13.2568 4.81464 13.9684H13.0625L13.0604 13.9663Z" fill="#81B64C"/>
            <path d="M10.7038 1.05052C13.6886 1.51157 9.32879 4.95789 7.95591 4.79578C6.64648 4.63999 7.90725 0.61894 10.7038 1.05052Z" fill="#B2E068"/>
        </svg>

        <style>{`
            @keyframes popIn {
                0% { opacity: 0; transform: scale(0.4); }
                70% { opacity: 1; transform: scale(1.08); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes pawnHop {
                0%   { transform: translateX(-50%) translateY(0) rotateY(0deg) scale(1, 1); }
                10%  { transform: translateX(-50%) translateY(6px) rotateY(0deg) scale(1.16, 0.82); }
                30%  { transform: translateX(-50%) translateY(-38px) rotateY(170deg) scale(0.9, 1.14); }
                50%  { transform: translateX(-50%) translateY(-50px) rotateY(360deg) scale(1, 1); }
                72%  { transform: translateX(-50%) translateY(-32px) rotateY(360deg) scale(0.94, 1.09); }
                90%  { transform: translateX(-50%) translateY(6px) rotateY(360deg) scale(1.18, 0.8); }
                100% { transform: translateX(-50%) translateY(0) rotateY(360deg) scale(1, 1); }
            }
            @keyframes shadowSync {
                0%   { transform: translate(-50%, -50%) scale(1, 1); opacity: 0.6; }
                10%  { transform: translate(-50%, -50%) scale(1.2, 1); opacity: 0.7; }
                50%  { transform: translate(-50%, -50%) scale(0.4, 0.6); opacity: 0.18; }
                90%  { transform: translate(-50%, -50%) scale(1.25, 1); opacity: 0.7; }
                100% { transform: translate(-50%, -50%) scale(1, 1); opacity: 0.6; }
            }
            @keyframes ripple {
                0%, 84% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; border-color: #81B64C; }
                90% { transform: translate(-50%, -50%) scale(0.75); opacity: 0.6; border-color: #B2E068; }
                100% { transform: translate(-50%, -50%) scale(2.1); opacity: 0; border-color: #81B64C; }
            }
            @keyframes platePulse {
                0%, 80% { transform: rotateX(62deg) rotateZ(45deg) scale(1); filter: brightness(1); }
                90% { transform: rotateX(62deg) rotateZ(45deg) scale(1.07); filter: brightness(1.7); }
                100% { transform: rotateX(62deg) rotateZ(45deg) scale(1); filter: brightness(1); }
            }
            @keyframes sparkBurst {
                0%, 84% { transform: rotate(var(--a)) translateY(0) scale(0); opacity: 0; }
                90% { transform: rotate(var(--a)) translateY(-8px) scale(1); opacity: 1; }
                100% { transform: rotate(var(--a)) translateY(-40px) scale(0); opacity: 0; }
            }
            @keyframes glowPulse {
                0%, 100% { transform: translateX(-50%) scale(0.85); opacity: 0.28; }
                50% { transform: translateX(-50%) scale(1.12); opacity: 0.5; }
            }
            @keyframes orbitSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes dotFade {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; }
            }
            .loader-enter {
                animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
            }
            .pawn-piece {
                transform-origin: 50% 100%;
                animation: pawnHop 1.8s cubic-bezier(0.45, 0, 0.55, 1) 0.5s infinite both;
            }
            .pawn-shadow {
                animation: shadowSync 1.8s cubic-bezier(0.45, 0, 0.55, 1) 0.5s infinite both;
            }
            .ripple {
                border: 2px solid #81B64C;
                border-radius: 9999px;
                animation: ripple 1.8s ease-out 0.5s infinite both;
            }
            .board-plate {
                animation: platePulse 1.8s ease-out 0.5s infinite both;
            }
            .spark {
                animation: sparkBurst 1.8s ease-out 0.5s infinite both;
            }
            .pawn-glow {
                animation: glowPulse 1.8s ease-in-out 0.5s infinite both;
            }
            .orbit {
                animation: orbitSpin 3.2s linear infinite;
            }
            .orbit-dot {
                animation: dotFade 1.6s ease-in-out infinite;
            }
        `}</style>
    </div>)
}

export default PawnLoader;
