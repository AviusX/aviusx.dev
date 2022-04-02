import type { NextPage } from 'next'
import Image from 'next/image';
import RoundedButton from '../components/RoundedButton/RoundedButton';
import PageSection from '../components/PageSection/PageSection'
import ProfilePicture from '../public/images/profile-picture.jpg';
import { ChevronDownIcon } from '@heroicons/react/solid';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
	return (
		<PageSection>
			<div className="flex flex-col-reverse xl:flex-row xl:h-full">
				{/* left section */}
				<div className="h-full flex flex-col mt-20 lg:mt-0 p-5 lg:justify-center gap-12">
					<h1 className="text-4xl lg:text-7xl font-bold tracking-widest text-primary uppercase">
						Hi, my name is <span className="text-tertiary">Hrijul</span>.
						I also go by <span className="text-tertiary">AviusX</span> online.
					</h1>
					<h2 className="text-2xl lg:text-4xl text-secondary tracking-wider">
						I'm a full stack developer. I've mainly worked with the MERN stack, but I love to learn and explore new things.
					</h2>
					<div className="self-center w-full sm:w-1/2 lg:w-3/12">
						<RoundedButton color="primary" className="w-full uppercase flex justify-center items-center">
							Contact me
							<ChevronDownIcon className="w-6 ml-4"/>
						</RoundedButton>
					</div>
				</div>
				{/* right (image) section */}
				<div className="flex justify-center items-center mt-12 xl:mt-0 xl:w-3/4 xl:bg-primary">
					{/* pfp frame */}
					<div className="relative flex justify-center items-center w-1/2 lg:w-1/3 xl:w-2/3">
						<div className={`${styles.pfpFrame} rounded-3xl rotate-12 relative z-10 overflow-hidden`}>
							<Image src={ProfilePicture} alt="me" />
						</div>
						{/* Background double frame */}
						<div className={`${styles.doubleFrame} rounded-3xl rotate-12 absolute top-4 lg:top-10`} />
					</div>
				</div>
			</div>
		</PageSection>
	)
}

export default Home
