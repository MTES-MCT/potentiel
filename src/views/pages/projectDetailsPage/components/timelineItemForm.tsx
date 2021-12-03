import React, { useState } from 'react'

export const TimelineItemForm = ({ action }) => {
    const [isHiddenForm, setIsHiddenForm] = useState(true)
    return (
        <div>
            {action.link ? (
                <div>
                    <a href={action.link} className="hover:bg-transparent">{action.title}</a>
                </div>
            ) : (
                <div>
                <label 
                    htmlFor='action'
                    className="hover:bg-transparent underline hover:no-underline cursor-pointer"
                    style={{color: "#0053B3"}}
                    onClick={() => setIsHiddenForm(!isHiddenForm)}
                >
                    { action.title }
                </label>
                {!isHiddenForm && (
                    <form className="flex items-center">
                        {action.title.split(' ').includes('date') && (
                            <input className="mt-2 mr-2 w-60 h-10" id='action' type='date'></input>
                        )}
                        {action.title.split(' ').includes('Transmettre') && (
                            <input className="mt-2 mr-2 w-60 h-10" id='action' type='file'></input>
                        )}
                        <button className="button h-10" style={{marginTop: 8}} type="submit">Enregistrer</button>
                        <a onClick={() => setIsHiddenForm(!isHiddenForm)}>Annuler</a>
                    </form>
                )}
                </div>
            )}
        </div>
    )
}