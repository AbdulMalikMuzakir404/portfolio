import { motion } from "framer-motion";

import { styles } from "@/app/styles";
import { staggerContainer } from "@/utils/motion";

export const StarWrapper = (Component: React.ComponentType) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.25 }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
      >
        <span className='hash-span'>
          &nbsp;
        </span>

        <Component />
      </motion.section>
    );
  };

export default StarWrapper;
