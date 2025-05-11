"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Signin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
        email,
        password,
    };

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Erreur de connexion :", errorData.message);
            return;
        }

        const data = await res.json();
        console.log("Token reçu :", data.access_token);

        localStorage.setItem("token", data.access_token);
        router.push("/teste")
    } catch (error) {
        console.error("Erreur réseau :", error);
    }

    setEmail("");
    setPassword("");
};

  return (
    <div className='bg-gray-100 flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center justify-center width-20 border-2 border-blue-300 rounded-lg shadow-lg p-8 bg-white'>
        <h1 className="text-2xl font-bold mb-4">Se connecter</h1>
        <form onSubmit={handleSubmit}>
             <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Adresse email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
            />
            </div>

            <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
            />
            </div>
            <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
            Se connecter
            </button>
            <div className='m-5'>
                <h1>Pas de compte ? <Link href="/signup" className='text-blue-600 underline'>S&apos;inscrire ici</Link> </h1> 
            </div>
        </form>
    </div>
    </div>
  )
}

export default Signin