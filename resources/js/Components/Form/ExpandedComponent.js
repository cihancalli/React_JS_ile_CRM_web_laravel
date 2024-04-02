import React from "react";

const ExpandedComponent = ({data}) => {
    return (
        <div dangerouslySetInnerHTML={{__html:data.productDescription}}/>
    )
};

export default ExpandedComponent;
