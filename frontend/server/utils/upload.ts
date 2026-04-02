import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

export async function handleFileUpload(event: any, fieldName: string = 'image') {
  const formData = await readMultipartFormData(event)
  if (!formData) return null

  const file = formData.find((item) => item.name === fieldName)
  const fields: Record<string, any> = {}
  
  // Extract other fields from the form
  formData.forEach((item) => {
    if (item.name && item.name !== fieldName) {
      fields[item.name] = item.data.toString()
    }
  })

  let imageUrl = null
  if (file && file.filename && file.data.length > 0) {
    const ext = file.filename.split('.').pop()
    const fileName = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    try {
      await mkdir(uploadDir, { recursive: true })
      await writeFile(join(uploadDir, fileName), file.data)
      imageUrl = `/uploads/${fileName}`
    } catch (e) {
      console.error('[ZGA] ❌ File upload failed:', e)
    }
  }

  return { fields, imageUrl }
}
