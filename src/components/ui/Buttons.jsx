import React from 'react'

export const NormalButton = ({classes, text, onClick}) => {
  return (
    <>
      <button className={`text-sm px-4 py-2 rounded-md cursor-pointer ${classes}`} onClick={onClick}>
        {text}
      </button>
    </>
  )
}
