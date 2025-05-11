"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const user = {
            name,
            email,
            password
        }
        console.log("Mbola mipa")
        try {
            console.log("Tafiditra")
            const res = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            console.log("Lasa")
            const data = await res.json()
            if (res.ok) {
                console.log("User created successfully:", data)
                setName("")
                setEmail("")
                setPassword("")
                router.push("/signin")
            }
            else {
                alert("Tsy poins")
                console.error("Error creating user:", data)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

  return (
    <div className='bg-gray-100 flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center justify-center width-20 border-2 border-blue-300 rounded-lg shadow-lg p-8 bg-white'>
        <h1 className="text-2xl font-bold mb-4">Inscription</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nom d&apos;utilisateur</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
            />
            </div>

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
            S&apos;inscrire
            </button>
            <div className='m-5'>
                <h1>Vous avez deja un compte ? <Link href="/signin" className='text-blue-600 underline'>Se connecter ici</Link></h1>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Signup