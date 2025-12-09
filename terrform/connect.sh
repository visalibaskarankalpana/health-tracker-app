#!/bin/bash

##############################################
# HealthConnect All-in-One Management Script
##############################################
# This script handles:
# - Infrastructure recreation (destroy/apply)
# - Backend deployment verification
# - Frontend connection to backend
# - Database setup
##############################################

##############################################
# CONFIGURATION
##############################################

# Frontend configuration (constant)
FRONTEND_DOMAIN="healthconnect.space"
S3_BUCKET="healthconnect.space"
S3_REGION="us-east-1"
FRONTEND_URL="https://healthconnect.space"

# Backend ALB URL - UPDATE THIS WITH YOUR ALB DNS
BACKEND_ALB_URL="http://healthcare-dev-alb-985138781.us-east-2.elb.amazonaws.com"

# AWS Region
AWS_REGION="us-east-2"

##############################################
# SCRIPT STARTS - DO NOT MODIFY BELOW
##############################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Script mode
MODE="${1:-connect}"
AUTO_APPROVE="${2:-no}"

show_banner() {
    echo ""
    echo -e "${BOLD}${CYAN}============================================${NC}"
    echo -e "${BOLD}${CYAN}   HealthConnect Management Script${NC}"
    echo -e "${BOLD}${CYAN}============================================${NC}"
    echo ""
}

show_usage() {
    echo "Usage: $0 [mode] [auto-approve]"
    echo ""
    echo "Modes:"
    echo "  connect      - Connect frontend to existing backend (default)"
    echo "  recreate     - Destroy and recreate infrastructure"
    echo "  update       - Update frontend URL only"
    echo "  verify       - Verify current setup"
    echo "  help         - Show this help"
    echo ""
    echo "Auto-approve:"
    echo "  yes          - Skip confirmations (use with caution!)"
    echo "  no           - Ask for confirmation (default)"
    echo ""
    echo "Examples:"
    echo "  $0 connect"
    echo "  $0 recreate yes"
    echo "  $0 update"
    echo "  $0 verify"
    echo ""
}

# Get ALB URL (using configured value)
get_alb_url() {
    echo -e "${YELLOW}Using configured Backend ALB URL...${NC}"
    
    if [ -z "$BACKEND_ALB_URL" ] || [ "$BACKEND_ALB_URL" == "" ]; then
        echo -e "${RED}ERROR: BACKEND_ALB_URL is not configured${NC}"
        echo -e "${YELLOW}Please set BACKEND_ALB_URL at the top of this script${NC}"
        return 1
    fi
    
    echo -e "${GREEN}ALB URL: $BACKEND_ALB_URL${NC}"
    return 0
}

# Verify backend is running
verify_backend() {
    echo -e "${YELLOW}Verifying backend connection...${NC}"
    
    MAX_ATTEMPTS=30
    ATTEMPT=0
    
    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        ATTEMPT=$((ATTEMPT + 1))
        ELAPSED=$((ATTEMPT * 10))
        
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$BACKEND_ALB_URL/" 2>/dev/null)
        
        if [ "$HTTP_STATUS" == "200" ]; then
            echo -e "${GREEN}Backend is ready (Status 200)${NC}"
            RESPONSE=$(curl -s "$BACKEND_ALB_URL/" 2>/dev/null)
            echo -e "${CYAN}Response: $RESPONSE${NC}"
            return 0
        fi
        
        if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
            echo -e "${YELLOW}Attempt $ATTEMPT/$MAX_ATTEMPTS (${ELAPSED}s) - Status: $HTTP_STATUS - Waiting...${NC}"
            sleep 10
        fi
    done
    
    echo -e "${RED}Backend not responding after ${ELAPSED}s${NC}"
    return 1
}

# Update frontend with backend URL
update_frontend() {
    echo ""
    echo -e "${BOLD}Updating Frontend${NC}"
    echo "=========================================="
    
    # Create temporary directory
    TEMP_DIR="/tmp/frontend-update-$(date +%s)"
    mkdir -p $TEMP_DIR
    echo -e "${GREEN}[1/6] Created temporary directory${NC}"

    # Download frontend from S3
    echo -e "${YELLOW}[2/6] Downloading frontend files from S3...${NC}"
    aws s3 sync s3://$S3_BUCKET $TEMP_DIR --region $S3_REGION
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}     ✓ Frontend files downloaded successfully${NC}"
    else
        echo -e "${RED}     ✗ ERROR: Failed to download from S3${NC}"
        return 1
    fi
    
    FILE_COUNT=$(find $TEMP_DIR -type f | wc -l)
    echo -e "${CYAN}     Downloaded $FILE_COUNT files${NC}"

    # Create API config file
    echo -e "${YELLOW}[3/6] Creating API configuration file...${NC}"
cat > $TEMP_DIR/api-config.js << 'EOFCONFIG'
// API Configuration - Auto-generated
const API_BASE_URL = 'BACKEND_URL_PLACEHOLDER';

const API_CONFIG = {
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const API_ENDPOINTS = {
    root: `${API_BASE_URL}/`,
    doctors: {
        list: `${API_BASE_URL}/doctors`,
        create: `${API_BASE_URL}/doctors`,
        delete: (id) => `${API_BASE_URL}/doctors/${id}`
    },
    patients: {
        list: `${API_BASE_URL}/patients`,
        create: `${API_BASE_URL}/patients`,
        delete: (id) => `${API_BASE_URL}/patients/${id}`
    },
    appointments: {
        list: `${API_BASE_URL}/appointments`,
        create: `${API_BASE_URL}/appointments`,
        delete: (id) => `${API_BASE_URL}/appointments/${id}`
    },
    patientRecords: {
        list: (patientId) => `${API_BASE_URL}/patient_records/${patientId}`,
        create: `${API_BASE_URL}/patient_records`,
        delete: (id) => `${API_BASE_URL}/patient_records/${id}`
    },
    docs: `${API_BASE_URL}/docs`
};

const apiCall = async (url, options = {}) => {
    const defaultOptions = {
        headers: API_CONFIG.headers,
        ...options
    };
    try {
        const response = await fetch(url, defaultOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

const API = {
    getDoctors: () => apiCall(API_ENDPOINTS.doctors.list),
    createDoctor: (data) => apiCall(API_ENDPOINTS.doctors.create, {method: 'POST', body: JSON.stringify(data)}),
    deleteDoctor: (id) => apiCall(API_ENDPOINTS.doctors.delete(id), {method: 'DELETE'}),
    getPatients: () => apiCall(API_ENDPOINTS.patients.list),
    createPatient: (data) => apiCall(API_ENDPOINTS.patients.create, {method: 'POST', body: JSON.stringify(data)}),
    deletePatient: (id) => apiCall(API_ENDPOINTS.patients.delete(id), {method: 'DELETE'}),
    getAppointments: () => apiCall(API_ENDPOINTS.appointments.list),
    createAppointment: (data) => apiCall(API_ENDPOINTS.appointments.create, {method: 'POST', body: JSON.stringify(data)}),
    deleteAppointment: (id) => apiCall(API_ENDPOINTS.appointments.delete(id), {method: 'DELETE'}),
    getPatientRecords: (patientId) => apiCall(API_ENDPOINTS.patientRecords.list(patientId)),
    createPatientRecord: (data) => apiCall(API_ENDPOINTS.patientRecords.create, {method: 'POST', body: JSON.stringify(data)}),
    deletePatientRecord: (id) => apiCall(API_ENDPOINTS.patientRecords.delete(id), {method: 'DELETE'})
};

console.log('API Configuration loaded:', {baseURL: API_BASE_URL});
EOFCONFIG

    # Replace placeholder with actual backend URL
    sed -i "s|BACKEND_URL_PLACEHOLDER|$BACKEND_ALB_URL|g" $TEMP_DIR/api-config.js
    echo -e "${GREEN}     ✓ API config file created${NC}"

    # Update existing JavaScript files
    echo -e "${YELLOW}[4/6] Updating JavaScript files with backend URL...${NC}"
    UPDATED=0

    # Find and update JS files
    for file in $(find $TEMP_DIR -name "*.js" -type f); do
        if [[ "$file" == "$TEMP_DIR/api-config.js" ]]; then
            continue
        fi
        
        # Replace old ALB URLs and localhost
        if grep -q "healthcare-dev-alb" "$file" || grep -q "localhost" "$file"; then
            sed -i "s|http://healthcare-dev-alb-[0-9]\+\.us-east-2\.elb\.amazonaws\.com|$BACKEND_ALB_URL|g" "$file"
            sed -i "s|http://localhost:[0-9]\+|$BACKEND_ALB_URL|g" "$file"
            sed -i "s|http://127.0.0.1:[0-9]\+|$BACKEND_ALB_URL|g" "$file"
            echo -e "${GREEN}     ✓ Updated: $(basename $file)${NC}"
            UPDATED=$((UPDATED + 1))
        fi
    done
    
    # Update HTML files
    for file in $(find $TEMP_DIR -name "*.html" -type f); do
        if grep -q "localhost" "$file"; then
            sed -i "s|http://localhost:[0-9]\+|$BACKEND_ALB_URL|g" "$file"
            sed -i "s|http://127.0.0.1:[0-9]\+|$BACKEND_ALB_URL|g" "$file"
            echo -e "${GREEN}     ✓ Updated: $(basename $file)${NC}"
            UPDATED=$((UPDATED + 1))
        fi
    done
    
    echo -e "${CYAN}     Total files updated: $UPDATED${NC}"

    # Upload updated files to S3
    echo -e "${YELLOW}[5/6] Uploading updated files to S3...${NC}"
    aws s3 sync $TEMP_DIR s3://$S3_BUCKET --region $S3_REGION --delete
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}     ✓ Files uploaded successfully${NC}"
    else
        echo -e "${RED}     ✗ ERROR: Failed to upload to S3${NC}"
        rm -rf $TEMP_DIR
        return 1
    fi

    # Test backend connection
    echo -e "${YELLOW}[6/6] Testing backend connection...${NC}"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_ALB_URL)
    
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo -e "${GREEN}     ✓ Backend is responding: Status 200 OK${NC}"
        RESPONSE=$(curl -s $BACKEND_ALB_URL)
        echo -e "${CYAN}     Response: $RESPONSE${NC}"
    else
        echo -e "${RED}     ✗ WARNING: Backend returned status $HTTP_STATUS${NC}"
    fi
    
    # Clean up
    rm -rf $TEMP_DIR
    echo -e "${GREEN}     ✓ Cleaned up temporary files${NC}"
    echo ""
    return 0
}

# Recreate infrastructure
recreate_infrastructure() {
    echo ""
    echo -e "${BOLD}${RED}⚠️  Infrastructure Recreate Disabled${NC}"
    echo ""
    echo -e "${YELLOW}This script no longer manages Terraform directly.${NC}"
    echo -e "${YELLOW}To recreate infrastructure, use Terraform commands:${NC}"
    echo ""
    echo -e "${CYAN}# Destroy infrastructure:${NC}"
    echo -e "  C:\\terraform\\terraform.exe destroy -auto-approve"
    echo ""
    echo -e "${CYAN}# Create infrastructure:${NC}"
    echo -e "  C:\\terraform\\terraform.exe apply -auto-approve"
    echo ""
    echo -e "${CYAN}# Then update frontend connection:${NC}"
    echo -e "  ./connect.sh connect"
    echo ""
    return 1
}

# Show current configuration
show_status() {
    echo ""
    echo -e "${BOLD}Current Configuration${NC}"
    echo "=========================================="
    
    if get_alb_url; then
        echo -e "${CYAN}Frontend:${NC}    $FRONTEND_URL"
        echo -e "${CYAN}Backend:${NC}     $BACKEND_ALB_URL"
        echo -e "${CYAN}API Docs:${NC}    $BACKEND_ALB_URL/docs"
        echo ""
        
        # Test backend
        echo -e "${YELLOW}Testing backend connection...${NC}"
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$BACKEND_ALB_URL/" 2>/dev/null)
        if [ "$HTTP_STATUS" == "200" ]; then
            echo -e "${GREEN}✓ Backend Status: Online (200 OK)${NC}"
            
            # Test if backend returns expected JSON
            RESPONSE=$(curl -s --connect-timeout 5 "$BACKEND_ALB_URL/" 2>/dev/null)
            if echo "$RESPONSE" | grep -q "HealthConnect API"; then
                echo -e "${GREEN}✓ Backend is responding correctly${NC}"
            fi
        else
            echo -e "${YELLOW}✗ Backend Status: Not responding (HTTP $HTTP_STATUS)${NC}"
        fi
        
        echo ""
        echo -e "${CYAN}Frontend Status:${NC}"
        echo -e "  Visit: $FRONTEND_URL"
        echo -e "  Should connect to: $BACKEND_ALB_URL"
    fi
    echo ""
}

# Main script logic
main() {
    show_banner
    
    case "$MODE" in
        connect)
            echo -e "${BOLD}Mode: Connect Frontend to Backend${NC}"
            echo ""
            get_alb_url || exit 1
            verify_backend || exit 1
            update_frontend || exit 1
            echo ""
            echo -e "${GREEN}============================================${NC}"
            echo -e "${GREEN}        CONNECTION COMPLETE!${NC}"
            echo -e "${GREEN}============================================${NC}"
            show_status
            ;;
        
        recreate)
            echo -e "${BOLD}Mode: Recreate Infrastructure${NC}"
            echo ""
            recreate_infrastructure || exit 1
            show_status
            ;;
        
        update)
            echo -e "${BOLD}Mode: Update Frontend URL${NC}"
            echo ""
            get_alb_url || exit 1
            update_frontend || exit 1
            echo -e "${GREEN}Frontend update complete!${NC}"
            ;;
        
        verify)
            echo -e "${BOLD}Mode: Verify Setup${NC}"
            show_status
            ;;
        
        help|--help|-h)
            show_usage
            exit 0
            ;;
        
        *)
            echo -e "${RED}Unknown mode: $MODE${NC}"
            echo ""
            show_usage
            exit 1
            ;;
    esac
    
    echo -e "${CYAN}Useful Commands:${NC}"
    echo "  Test API:     curl $BACKEND_ALB_URL/doctors"
    echo "  View Docs:    open $BACKEND_ALB_URL/docs"
    echo "  Open Frontend: open $FRONTEND_URL"
    echo ""
}

# Run main function
main
