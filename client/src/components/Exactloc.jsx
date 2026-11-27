
// FaLocationDot
import { FaLocationDot } from "react-icons/fa6";
import { openMap } from "../utils/map";

const Exactloc = ({
    company,
    city,
    state,
    country,
    lat,
    lng
}) => {
    if (lat !== 20.593684 && lng !== 78.96288) {
        return (

            <div
                onClick={() =>
                    openMap(
                        company,
                        city,
                        state,
                        country,
                        lat,
                        lng
                    )
                }
                style={{
                    cursor: "pointer",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                }}
            >
                <FaLocationDot size={20} />
                View Location

            </div>

        );
    } else {
        return (
            <div>   </div>
        );
    }
};

export default Exactloc;