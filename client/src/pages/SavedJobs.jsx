import { useEffect, useState } from "react";
import {
  getSavedJobs,
  unsaveJob,
  applyJob,
} from "../api/jobActivityApi";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const SavedJobs = () => {

  const [savedJobs,setSavedJobs] =
    useState([]);

  const [loading,setLoading] =
    useState(true);

  const loadSaved = async () => {

    try{

      setLoading(true);

      const data =
        await getSavedJobs();

      setSavedJobs(data || []);

    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };

  useEffect(()=>{

    loadSaved();

  },[]);

  const removeSaved =
    async(jobId)=>{

      await unsaveJob(jobId);

      loadSaved();

    };

  const trackApply =
    async(job)=>{

      await applyJob(
        job.job_id
      );

      if(
        job.apply_link
      ){

        window.open(
          job.apply_link,
          "_blank"
        );

      }

      alert(
        "Application tracked"
      );

    };

  return(

<div
style={{

minHeight:"100vh",

background:
"linear-gradient(135deg,#eef4ff,#f8fbff,#edf2ff)",

padding:"45px 20px"

}}
>

<style>

{`

.saved-title{

font-size:38px;

font-weight:800;

background:
linear-gradient(
90deg,
#4f46e5,
#0ea5e9
);

-webkit-background-clip:text;

-webkit-text-fill-color:
transparent;

}

.saved-card{

background:
rgba(
255,
255,
255,
0.82
);

backdrop-filter:
blur(18px);

border-radius:
28px;

border:
1px solid
rgba(
255,
255,
255,
0.6
);

box-shadow:

0 15px 45px
rgba(
79,
70,
229,
0.08
);

transition:
0.3s;

overflow:hidden;

position:relative;

}

.saved-card:hover{

transform:
translateY(-8px);

box-shadow:

0 30px 60px
rgba(
79,
70,
229,
0.18
);

}

.company-logo{

width:70px;

height:70px;

border-radius:18px;

object-fit:cover;

background:white;

padding:8px;

box-shadow:

0 5px 18px
rgba(
0,
0,
0,
0.1
);

}

.salary{

background:

linear-gradient(
90deg,
#4f46e5,
#2563eb
);

color:white;

padding:

8px 15px;

border-radius:

999px;

font-size:13px;

font-weight:700;

}

.apply-btn{

background:

linear-gradient(
90deg,
#4f46e5,
#2563eb
);

border:none;

padding:

11px 22px;

border-radius:

999px;

font-weight:700;

transition:.25s;

}

.apply-btn:hover{

transform:
scale(1.05);

}

.remove-btn{

border-radius:
999px;

padding:

11px 22px;

font-weight:700;

}

.glow{

position:absolute;

width:220px;

height:220px;

background:

#6366f120;

filter:

blur(60px);

top:-70px;

right:-70px;

}

.empty-card{

background:

white;

border-radius:

25px;

padding:

80px;

box-shadow:

0 15px 35px
rgba(
0,
0,
0,
0.05
);

}

`}

</style>

<div className="container">

<div
className="
d-flex
justify-content-between
align-items-center
mb-5
"
>

<div>

<h1
className="
saved-title
"
>

Saved Jobs

</h1>

<p
className="
text-muted
mb-0
"
>

Your premium job collection

</p>

</div>

<div
className="
salary
"
>

{savedJobs.length}

Saved

</div>

</div>

{loading &&

<div
className="
text-center
mt-5
"
>

<div
className="
spinner-border
text-primary
"
></div>

</div>

}

{

!loading &&

savedJobs.length===0 &&

<div
className="
empty-card
text-center
"
>

<h3>

No Saved Jobs

</h3>

<p
className="
text-muted
"
>

Bookmark jobs and build your dream career list.

</p>

</div>

}

{

savedJobs.map(
(item)=>{

const job=
item.job;

return(

<div

key={item._id}

className="
saved-card
p-4
mb-4
"

>

<div
className="
glow
"
></div>

<div
className="
row
align-items-center
"
>

<div
className="
col-md-2
text-center
"
>

<img

className="
company-logo
"

src={

job
?.company_logo ||

"https://ui-avatars.com/api/?name="+
encodeURIComponent(
job?.company||
"Job"
)

}

alt=""

/>

</div>

<div
className="
col-md-7
"
>

<h4
className="
fw-bold
"
>

{

job?.title

}

</h4>

<div
className="
text-muted
mb-2
"
>

🏢

{

job?.company

||

"Company"

}

</div>

<div
className="
text-muted
"
>

📍

{

job?.location

||

job?.city

||

"Remote"

}

</div>

{

job?.salary &&

<div
className="
mt-3
"
>

<span
className="
salary
"
>

💰

{

job.salary

}

</span>

</div>

}

</div>

<div
className="
col-md-3
text-end
"
>

<div
className="
d-flex
flex-column
gap-2
"
>

<button

className="
btn
apply-btn
text-white
"

onClick={()=>

trackApply(
job
)

}

>

🚀 Apply

</button>

<button

className="
btn
btn-outline-danger
remove-btn
"

onClick={()=>

removeSaved(
job._id
)

}

>

🗑 Remove

</button>

</div>

</div>

</div>

</div>

);

})

}

</div>

</div>

);

};

export default SavedJobs;