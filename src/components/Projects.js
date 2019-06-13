import React from 'react';

const Projetcs = () => {
    return (
        <div className="projects">
            <h2 className="heading">Projects </h2>
            <div className="project-container">
                <div className="project">
                    <div className="project-image"></div>
                    <div className="project-info">
                        <h3>SAP HCI Integration</h3>
                        <p>
                            SAP HCI is a cloud-based integration platform hosted in HANA Cloud platform for integrating cloud applications with other cloud and on premise solutions. The solution supports both process and data integration needs. Since SAP HCI is offered as a service, the on demand solution provides highest level of security features such as content encryption and signing, certificate based authentication, encrypted data storage, data isolation at run time as well as persistency.
                        </p>
                    </div>
                </div>
                <div className="project">
                    <div className="project-image"></div>
                    <div className="project-info">
                        <h3>Cisco CloudCenter (formerly CliQr)</h3>
                        <p>
                            Cisco CloudCenter (formerly CliQr) to more securely deploy and manage ap- plications in data center, private cloud, and public cloud environments. This application-centric cloud management solution helps you modernize your data center or add public cloud application deployment to your service offering.
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Projetcs;