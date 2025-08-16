import Image from 'next/image'
import React from 'react'

export default function Page() {
  return (
    <div>
      Workspace
      <Image src={'/book.png'} height={200} width={200} alt='book'/>
    </div>
  )
}
