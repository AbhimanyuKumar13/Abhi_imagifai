import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import styles from "./Result.module.css";

const Result = () => {
  const [img, setImg] = useState(assets.preImage);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const image = await generateImage(input);
      if (image) {
        setIsImageLoaded(true);
        setImg(image);
      }
    }

    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className={styles.page}
    >
      <div className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <img src={img} alt="generated" className={styles.image} />
          <span
            className={`${styles.loadingBar} ${
              loading ? styles.loadingActive : ""
            }`}
          />
        </div>

        {loading && <p className={styles.loadingText}>Loading...</p>}
      </div>

      {!isImageLoaded && (
        <div className={styles.inputContainer}>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className={styles.input}
          />
          <button type="submit" className={styles.generateBtn}>
            Generate
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className={styles.actionContainer}>
          <button
            type="button"
            onClick={() => setIsImageLoaded(false)}
            className={styles.secondaryBtn}
          >
            Generate another
          </button>

          <a
            href={img}
            download
            className={styles.primaryBtn}
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
