import React from "react";
// icons
import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt"
import { FaLink } from "@react-icons/all-files/fa/FaLink";

const Eventos = ({ eventos, transformDate }) => {
    return (
        <div className="list-group">
            {
                eventos.map(({ activityname, course, url, timestart, icon }, index) => {
                    return (
                        <div className="container" key={index}>
                            {
                                index == 0 ?
                                    <div className="list-group-item" key={index}>
                                        <h5 className="mb-1">
                                            <a href={course.viewurl}>IR AL CURSO&nbsp;<FaExternalLinkAlt /></a>
                                        </h5>
                                    </div>
                                    :
                                    null
                            }
                            <div className="list-group-item">
                                <h5 className="mb-1">
                                    <a href={url}>{activityname}&nbsp;<FaLink /></a>
                                </h5>
                                <div className="row g-0">
                                    <div className="col-2 mb-1">
                                        <img className="fluid-img" height={24} width={24} src={icon.iconurl} />
                                    </div>
                                    <div className="col-5 mb-1">
                                        <strong>FECHA CIERRE:</strong>
                                    </div>
                                    <div className="col-5 mb-1">
                                        {transformDate(timestart)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Eventos