import React, { useState, useEffect } from "react";
import axios from "axios";

export const VideoPlayer = (props) => {
  const { src, sub } = props;
  const [subs, setSubs] = useState(false);

  const [subInfos, setSubInfos] = useState([]);

  useEffect(() => {
    axios.get(sub).then((res) => {
      if (res.data) {
        if (res.data.message === "no subtitles") {
          setSubs(false);
        } else {
          setSubs(true);
        }
      }

      if (res.data._streams) {
        setSubs(false);

        var rData = res.data._streams;
        let subTmp = {};
        let arrayTmp = [];

        for (const r of rData) {
          if (typeof r === "string") {
            var rParse = r.split(`"`);
            const name = rParse[1];
            const lang = rParse[3].split(".")[0];
            subTmp = { name, lang };
          }

          if (r?.type) {
            var sub64 = new Buffer.from(r.data).toString();
            const url = URL.createObjectURL(new Blob([sub64], { type: "text/plain" }));
            subTmp.src = url;
            subTmp = { ...subTmp, src: url };

            if (r.data.length > 20) {
              arrayTmp.push(subTmp);
            }
          }
        }

        setSubInfos(arrayTmp);
      }
    });
  }, []);

  return (
    <video id="videoPlayer" width="100%" controls crossOrigin="use-credentials" controlsList="nodownload">
      <source src={src} type="video/mp4" />
      {subs ? <track label="English" kind="subtitles" srcLang="en" src={sub} /> : null}

      {subInfos.map((s, i) => (
        <track key={i} label={s.name} kind="subtitles" srcLang={s.lang} src={s.src} />
      ))}
    </video>
  );
};

export default VideoPlayer;
