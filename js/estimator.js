document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const plotLengthFtInput = document.getElementById('plotLengthFt');
    const plotLengthInInput = document.getElementById('plotLengthIn');
    const plotWidthFtInput = document.getElementById('plotWidthFt');
    const plotWidthInInput = document.getElementById('plotWidthIn');
    const plotAreaInput = document.getElementById('plotArea');
    const calculateBtn = document.getElementById('calculateBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const resultArea = document.getElementById('resultArea');
    const resultPackage = document.getElementById('resultPackage');
    const resultRate = document.getElementById('resultRate');
    const resultTotal = document.getElementById('resultTotal');
    const costEstimatorForm = document.getElementById('costEstimatorForm');
    
    // Package rates
    const packageRates = {
        vastu: { rate: 2, name: "Vastu Naksha" },
        '3d': { rate: 4, name: "3D Naksha" },
        complete: { rate: 5, name: "Complete Package" }
    };
    
    // Current calculation values
    let currentCalculation = {
        lengthFt: 0,
        lengthIn: 0,
        widthFt: 0,
        widthIn: 0,
        area: 0,
        package: 'vastu',
        constructionType: 'residential',
        totalCost: 0
    };

    // Track conversion state
    let isAutoConverting = false;

    // Function to automatically convert inches >11 to feet
    function normalizeInches(inchesInput, feetInput) {
        if (isAutoConverting) return parseFloat(inchesInput.value) || 0;
        
        let inches = parseFloat(inchesInput.value) || 0;
        
        if (inches > 11) {
            const extraFeet = Math.floor(inches / 12);
            const remainingInches = (inches % 12);
            
            feetInput.value = (parseFloat(feetInput.value) || 0) + extraFeet;
            inchesInput.value = remainingInches;
            
            return remainingInches;
        }
        
        return inches;
    }
    
    // Convert feet and inches to decimal feet
    function toDecimalFeet(feet, inches) {
        return parseFloat(feet) + (parseFloat(inches) / 12);
    }
    
    // Calculate plot area when dimensions change
    function calculatePlotArea() {
        // First handle any inches >11 (original functionality)
        const lengthIn = normalizeInches(plotLengthInInput, plotLengthFtInput);
        const widthIn = normalizeInches(plotWidthInInput, plotWidthFtInput);
        
        // Convert decimal feet to feet and inches (NO ROUNDING)
        function convertDecimalFeet(inputFt, inputIn) {
            const value = parseFloat(inputFt.value);
            if (!isNaN(value) && value % 1 !== 0) {
                isAutoConverting = true;
                
                const feet = Math.floor(value);
                const decimalPart = value - feet;
                let inches = (decimalPart * 12);
                
                // Only add existing inches if they weren't just converted
                if (inputIn.value && parseFloat(inputIn.value) > 0 && 
                    !inputIn.dataset.justConverted) {
                    inches += parseFloat(inputIn.value);
                }
                
                // Update the fields
                inputFt.value = feet;
                inputIn.value = inches % 1 === 0 ? parseInt(inches) : parseFloat(inches.toFixed(2));
                inputIn.dataset.justConverted = "true";
                
                setTimeout(() => {
                    isAutoConverting = false;
                    delete inputIn.dataset.justConverted;
                }, 100);
                
                return { feet, inches };
            }
            return null;
        }
        
        // Apply conversion to both length and width if needed
        convertDecimalFeet(plotLengthFtInput, plotLengthInInput);
        convertDecimalFeet(plotWidthFtInput, plotWidthInInput);
        
        // Get values with decimal inches
        const lengthFt = parseFloat(plotLengthFtInput.value) || 0;
        const finalLengthIn = parseFloat(plotLengthInInput.value) || 0;
        const widthFt = parseFloat(plotWidthFtInput.value) || 0;
        const finalWidthIn = parseFloat(plotWidthInInput.value) || 0;
        
        const length = toDecimalFeet(lengthFt, finalLengthIn);
        const width = toDecimalFeet(widthFt, finalWidthIn);
        const area = length * width;
        
        currentCalculation.lengthFt = lengthFt;
        currentCalculation.lengthIn = finalLengthIn;
        currentCalculation.widthFt = widthFt;
        currentCalculation.widthIn = finalWidthIn;
        currentCalculation.area = area;
        
        plotAreaInput.value = area.toFixed(3);
        resultArea.textContent = `${area.toFixed(3)} sq.ft`;
    }
    
    // Update package selection
    function updatePackageSelection() {
        const selectedPackage = document.querySelector('input[name="designPackage"]:checked').value;
        const selectedConstruction = document.querySelector('input[name="constructionType"]:checked').value;
        
        currentCalculation.package = selectedPackage;
        currentCalculation.constructionType = selectedConstruction;
        
        resultPackage.textContent = packageRates[selectedPackage].name;
        resultRate.textContent = `₹${packageRates[selectedPackage].rate}/sq.ft`;
    }
    
    // Calculate total cost
    function calculateTotalCost() {
        const area = currentCalculation.area;
        const rate = packageRates[currentCalculation.package].rate;
        const totalCost = area * rate;
        
        currentCalculation.totalCost = totalCost;
        resultTotal.textContent = `₹${totalCost.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        // Show success feedback
        showAlert('Cost calculated successfully!', 'success');
    }
    
    // Show alert message
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.estimator-alert');
        if (existingAlert) existingAlert.remove();
        
        // Create alert
        const alert = document.createElement('div');
        alert.className = `estimator-alert alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(alert);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
    
    // Reset form function
    function resetForm() {
        costEstimatorForm.reset();
        currentCalculation = {
            lengthFt: 0,
            lengthIn: 0,
            widthFt: 0,
            widthIn: 0,
            area: 0,
            package: 'vastu',
            constructionType: 'residential',
            totalCost: 0
        };
        resultArea.textContent = '0 sq.ft';
        resultTotal.textContent = '₹0';
    }
    
    // Send via WhatsApp
    function sendViaWhatsApp() {
        // Validate if cost is calculated
        if (currentCalculation.totalCost <= 0) {
            showAlert('Please calculate cost estimate first! Click "Calculate Estimate"', 'error');
            calculateBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            calculateBtn.focus();
            return;
        }
        
        // Validate if area is calculated
        if (currentCalculation.area === 0) {
            showAlert('Please enter plot dimensions first', 'error');
            return;
        }
        
        const phoneNumber = '917061570522'; // Replace with your WhatsApp number
        const packageName = packageRates[currentCalculation.package].name;
        const packageRate = packageRates[currentCalculation.package].rate;
        
        // Format inches to show decimals only when needed
        const formatInches = (inches) => {
            const num = parseFloat(inches);
            return num % 1 === 0 ? num.toString() : num.toFixed(2);
        };
        
        const message = `Hello UdaanBase,\n\nI'm interested in your services. Here are my details:\n\n` +
                        `*Plot Dimensions:* ${currentCalculation.lengthFt}' ${formatInches(currentCalculation.lengthIn)}" x ${currentCalculation.widthFt}' ${formatInches(currentCalculation.widthIn)}"\n` +
                        `*Plot Area:* ${currentCalculation.area.toFixed(3)} sq.ft\n` +
                        `*Construction Type:* ${currentCalculation.constructionType.charAt(0).toUpperCase() + currentCalculation.constructionType.slice(1)}\n` +
                        `*Design Package:* ${packageName} (₹${packageRate}/sq.ft)\n` +
                        `*Estimated Cost:* ₹${currentCalculation.totalCost.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}\n\n` +
                        `Please contact me for further discussion.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Reset form after submission
        resetForm();
    }
    
    // Event Listeners
    plotLengthFtInput.addEventListener('input', calculatePlotArea);
    plotLengthInInput.addEventListener('input', function() {
        normalizeInches(plotLengthInInput, plotLengthFtInput);
        calculatePlotArea();
    });
    plotWidthFtInput.addEventListener('input', calculatePlotArea);
    plotWidthInInput.addEventListener('input', function() {
        normalizeInches(plotWidthInInput, plotWidthFtInput);
        calculatePlotArea();
    });
    
    document.querySelectorAll('input[name="designPackage"]').forEach(function(radio) {
        radio.addEventListener('change', updatePackageSelection);
    });
    
    document.querySelectorAll('input[name="constructionType"]').forEach(function(radio) {
        radio.addEventListener('change', updatePackageSelection);
    });
    
    calculateBtn.addEventListener('click', calculateTotalCost);
    whatsappBtn.addEventListener('click', sendViaWhatsApp);
    
    // Initialize
    updatePackageSelection();
});