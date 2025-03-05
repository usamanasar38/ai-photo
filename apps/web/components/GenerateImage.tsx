"use client"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { BACKEND_BASE_URL } from "@/app/config"
import { SelectModel } from "./Models"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
export function GenerateImage() {
    const [prompt, setPrompt] = useState("")
    const [selectedModel, setSelectedModel] = useState<string>()
    const [isGenerating, setIsGenerating] = useState(false)
    const { getToken } = useAuth()
    const router = useRouter()

    const handleGenerate = async () => {
        if (!prompt || !selectedModel) return
        
        setIsGenerating(true)
        try {
            const token = await getToken()
            await axios.post(`${BACKEND_BASE_URL}/ai/generate`, {
                prompt,
                modelId: selectedModel,
                num: 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Image generation started!")
            setPrompt("")
        } catch (error) {
            toast.error("Failed to generate image")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <motion.div 
            className="max-w-2xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >

            <div className="space-y-4">
                <SelectModel
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Step 2 - Give a prompt"
                        className="min-h-[120px] text-2xl resize-none"
                    />
                </motion.div>

                <motion.div 
                    className="flex justify-end"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt || !selectedModel}
                        className="px-8"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGenerating ? "Generating..." : "Generate (1 credit)"}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}