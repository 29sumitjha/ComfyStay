const Listing =require("../models/listing.js");
const axios = require("axios");


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs",{ showSearch: false });
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id).populate({path: "reviews", populate :{ path: "author" }}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
    try{
    const query = req.body.listing.location;
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: query,
            format: "json",
            limit: 1
        },
        headers: {
            "User-Agent": process.env.USER_AGENT// required
        }
    });

    if (response.data.length === 0) {
        req.flash("error", "Location not found!");
        return res.redirect("/listings/new");
    }

    const lat = parseFloat(response.data[0].lat);
    const lon = parseFloat(response.data[0].lon);

    // Same format as Mapbox (GeoJSON)
    const geometry = { type: "Point", coordinates: [lon, lat] };
    console.log(geometry);



    let url= req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = geometry; 
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    }catch(err){
        console.error("Error creating listing:", err);
        req.flash("error", "Something went wrong while creating listing.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originialImageUrl = listing.image.url;
    originialImageUrl = originialImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originialImageUrl},{ showSearch: false });
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename = req.file.filename;
        listing.image= {url, filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};