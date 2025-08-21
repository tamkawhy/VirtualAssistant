import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const defaultVoiceRef = useRef(null);

  const synth = window.speechSynthesis;

  // ---------------- LOGOUT ----------------
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.error(error);
      setUserData(null);
    }
  };

  // ---------------- SPEECH SYNTHESIS ----------------
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";

    if (defaultVoiceRef.current) {
      utterance.voice = defaultVoiceRef.current;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        safeRecognition();
      }, 800);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  // ---------------- HANDLE COMMAND ----------------
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "twitter-open") {
      window.open(`https://x.com/`, "_blank");
    }
    if (type === "chatgpt-open") {
      window.open(`https://chatgpt.com/`, "_blank");
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube-search" || type === "youtube-play") {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          userInput
        )}`,
        "_blank"
      );
    }
  };

  // ---------------- ERROR HANDLER ----------------
  const handleRecognitionError = (error) => {
    switch (error) {
      case "network":
        console.error("Network issue. Check your internet.");
        break;
      case "not-allowed":
        alert("Microphone access denied. Please enable it in browser settings.");
        break;
      case "no-speech":
        console.log("No speech detected, retrying...");
        break;
      default:
        console.error("Recognition error:", error);
    }
  };

  // ---------------- SAFE RECOGNITION ----------------
  const safeRecognition = (() => {
    let retryDelay = 1000;
    return () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognitionRef.current.start();
          retryDelay = 1000; // reset if success
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Start error:", err);
            retryDelay = Math.min(retryDelay * 2, 30000); // backoff
          }
        }
        setTimeout(() => {
          if (!isSpeakingRef.current && !isRecognizingRef.current) {
            safeRecognition();
          }
        }, retryDelay);
      }
    };
  })();

  // ---------------- INIT ----------------
  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      const voices = synth.getVoices();
      const viVoice = voices.find((v) => v.lang === "vi-VN");
      if (viVoice) defaultVoiceRef.current = viVoice;
    };
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    // Setup recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let watchdog;

    recognition.onstart = () => {
      clearTimeout(watchdog);
      isRecognizingRef.current = true;
      setListening(true);
      // restart if stuck for >15s
      watchdog = setTimeout(() => {
        console.warn("Recognition stuck, restarting...");
        recognition.stop();
      }, 15000);
    };

    recognition.onend = () => {
      clearTimeout(watchdog);
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 1000);
      }
    };

    recognition.onerror = (event) => {
      clearTimeout(watchdog);
      handleRecognitionError(event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => safeRecognition(), 1000);
      }
    };

    recognition.onresult = async (e) => {
      clearTimeout(watchdog);
      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    safeRecognition();

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
      clearTimeout(watchdog);
    };
  }, []);

  // ---------------- RENDER ----------------
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden">
      {/* Mobile Menu */}
      <CgMenuRight
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <RxCross1
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]"
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]"
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col">
          {userData.history?.map((his, index) => (
            <span
              key={index}
              className="text-gray-200 text-[18px] truncate"
            >
              {his}
            </span>
          ))}
        </div>
      </div>

      {/* Desktop Menu */}
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute top-[100px] right-[20px] bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      {/* Assistant */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-[250px] h-[300px] flex justify-center items-center overflow-hidden rounded-2xl shadow-lg">
          <img
            src={userData?.assistantImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-[28px] font-bold neon-text">
          I'm {userData?.assistantName}
        </h1>
        {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
        {aiText && <img src={aiImg} alt="" className="w-[200px]" />}

        <h1 className="text-white text-[18px] font-semibold text-wrap">
          {userText ? userText : aiText ? aiText : null}
        </h1>
      </div>
    </div>
  );
}

export default Home;