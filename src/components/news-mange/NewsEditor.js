import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")
    useEffect(()=>{
        const html = props.content
        console.log("props",props)
        // console.log("111",html)
        if(html===undefined) return 
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState)
        }
    },[props.content])
    return (

        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={(editorState) => setEditorState(editorState)}
            style={{ minHeight: "500px" }}

            onBlur={() => {
                props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }}
        />

    )
}

