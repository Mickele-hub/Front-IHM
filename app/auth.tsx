// "use client";

// import { useState } from "react";
// import api from "@/lib/api"; // Importation de l'objet api

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true); // Basculer entre connexion et inscription
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const endpoint = isLogin ? "/auth/login" : "/auth/register";
//       const response = await api.post(endpoint, { username, password }); // Utilisation de api pour les requêtes
//       setMessage(response.data.message || "Success");

//       if (isLogin && response.data.accessToken) {
//         // Stocker le token JWT dans localStorage
//         localStorage.setItem("token", response.data.accessToken);
//         setMessage("Login successful!");
//       }
//     } catch (error: any) {
//       setMessage(error.response?.data?.message || "An error occurred");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
//         <h1 className="text-2xl font-bold mb-4">
//           {isLogin ? "Connexion" : "Inscription"}
//         </h1>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Nom d utilisateur</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-3 py-2 border rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Mot de passe</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border rounded"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//           >
//             {isLogin ? "Se connecter" : "S'inscrire"}
//           </button>
//         </form>
//         <p className="mt-4 text-sm text-center">
//           {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-blue-500 underline"
//           >
//             {isLogin ? "S'inscrire" : "Se connecter"}
//           </button>
//         </p>
//         {message && <p className="mt-4 text-center text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// }
