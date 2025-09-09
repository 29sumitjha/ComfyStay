if (listing.geometry && listing.geometry.coordinates) {
    const map = new maplibregl.Map({
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: listing.geometry.coordinates,
        zoom: 9.5,
        container: 'map',
    });

    // const marker = new maplibregl.Marker({color: "red"})
    // .setLngLat(listing.geometry.coordinates) // already [lon, lat]
    // .setPopup(new maplibregl.Popup({ offset: 25 })
    // .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`))
    // .addTo(map);

    const marker = new maplibregl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);

    const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`);

    // Show popup on hover
    marker.getElement().addEventListener('mouseenter', () => {
        popup.setLngLat(listing.geometry.coordinates).addTo(map);
    });

    // Hide popup when mouse leaves
    marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
    });
}else{
    document.getElementById("map").innerHTML ="<p style='text-align:center; margin-top:2rem;'>Map not available for this listing</p>";
}
