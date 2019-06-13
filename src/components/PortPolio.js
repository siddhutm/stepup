import React from 'react';
import Intro from './Intro.js';
import AboutMe from './AboutMe.js';
import Experience from './Experience.js';
import Education from './Education.js';
import Projects from './Projects.js';
import Skills from './Skills.js'
import './PortPolio.css';

class PortPolio extends React.Component {
    renderIntro() {
        return (
            <div className='introLayout'>
                {<Intro/>}
                <div className="overlay"></div>
            </div>
        );
    }

    renderInfo() {
        return <AboutMe/>
    }

    renderExperience() {
        return <Experience/>;
    }

    renderEducation() {
        return <Education/>;
    }

    renderProjects() {
        return <Projects/>; 
    }

    renderSkills() {
        return <Skills/>;
    }

    render() {
        return (
            <div className='portPolio'>
                { this.renderIntro() }
                { this.renderInfo() }
                { this.renderExperience() }
                { this.renderEducation() }
                { this.renderProjects() }
                { this.renderSkills() }
            </div>
        )
    }
}

export default PortPolio;